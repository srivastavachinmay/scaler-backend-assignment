import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import { Interview } from "../entity/Interview";

export async function getInterviews(request: Request, response: Response, next: NextFunction) {
    const interviewRepo = getManager().getRepository(Interview);

    const res = await interviewRepo.createQueryBuilder("interview")
        .innerJoinAndSelect("interview.participants", "participants")
        .getMany();

    response.json({ interviews: res })
}
