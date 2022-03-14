import { NextFunction, Request, Response } from "express";
import { getManager }                      from "typeorm";
import { Interview }                       from "../../entity/Interview";

export async function getInterviews( request: Request, response: Response, next: NextFunction ) {
    const interviewRepo = getManager().getRepository(Interview);
    
    const res = await interviewRepo.createQueryBuilder("interview")
        .leftJoinAndSelect("interview.participants", "participants")
        .getMany();
    
    response.json({ interviews: res });
}

export async function getInterviewById( request: Request, response: Response, next: NextFunction ) {
    const interviewId = request.params.id;
    const interviewRepo = getManager().getRepository(Interview);
    const res = await interviewRepo.findOne(interviewId, {
        relations: ['participants']
    });
    response.json(res);
}
