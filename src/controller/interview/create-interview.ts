import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import { IInterview, Interview } from "../../entity/Interview";
import RequestError from "../../middlewares/request-error";
import { Participant } from "../../entity/Participant";

export async function createInterview(request: Request, response: Response, next: NextFunction) {
    const interviewRepository = getManager().getRepository(Interview);
    const interview = request.body as IInterview & { participants: string[] };

    const startDateTime = new Date(interview.startDateTime);
    const endDateTime = new Date(interview.endDateTime);

    if ( startDateTime >= endDateTime ) {
        const error = new RequestError("Start time must be more than end time!", 400);
        return next(error);
    }

    if ( interview.participants.length < 2 ) {
        const error = new RequestError("Total participants should not be less than two!!", 400);
        return next(error);
    }

    const participantRepository = getManager().getRepository(Participant);

    const participants = await participantRepository.createQueryBuilder("participant")
        .leftJoinAndSelect("participant.interviews", "interviews")
        .where("participant.email in (:...emails)", { emails: interview.participants })
        .getMany();

    const validEmail: Record<string, boolean> = {};

    let hasInterviewer = false;

    for ( const email of interview.participants )
        validEmail[email] = false;

    for ( let participant of participants ) {
        validEmail[participant.email] = true;

        if ( participant.type === "Interviewer" )
            hasInterviewer = true;

        if ( !participant.interviews ) continue;

        for ( let existingInterviews of participant.interviews ) {
            let isInvalidSlot = false;
            if (
                ( startDateTime <= existingInterviews.startDateTime &&
                    endDateTime >= existingInterviews.startDateTime &&
                    endDateTime <= existingInterviews.endDateTime )
                ||
                ( startDateTime >= existingInterviews.startDateTime &&
                    startDateTime <= existingInterviews.endDateTime &&
                    endDateTime >= existingInterviews.endDateTime )
                ||
                ( startDateTime >= existingInterviews.startDateTime
                    && endDateTime <= existingInterviews.endDateTime )
                ||
                ( startDateTime <= existingInterviews.startDateTime
                    && endDateTime >= existingInterviews.endDateTime )
            )
                isInvalidSlot = true;

            if ( isInvalidSlot ) {
                const error = new RequestError(
                    `${ participant.email } is having another interview during this time slot. Please reschedule!`,
                    400);
                return next(error);
            }
        }
    }

    if ( !hasInterviewer ) {
        const error = new RequestError(`Needs interviewer to conduct an interview!`, 400);
        return next(error);
    }

    Object.keys(validEmail).forEach(email => {
        if ( !validEmail[email] ) {
            const error = new RequestError(`${ email } does not exist!`, 400);
            return next(error);
        }
    });

    const res = await interviewRepository.save({ ...interview, participants });
    response.json({ ...interview, id: res.id })
}
