import { Participant } from "../../entity/Participant";
import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";

export async function getParticipants(request: Request, response: Response, next: NextFunction) {
    const participantRepo = getManager().getRepository(Participant);

    const res = await participantRepo.find();

    response.json({ participants: res })
}
