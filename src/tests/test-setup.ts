import * as dotenv from 'dotenv'
dotenv.config()

import getConnection from "../utils/get-connection";
import { Application } from "express";
import app from "../app";
import { Interview } from "../entity/Interview";
import { Participant } from "../entity/Participant";


jest.setTimeout(20_000);

export let PARTICIPANTS: Participant[] = []
export let INTERVIEWERS: Participant[] = []

export const describeWithApp = (
    name: string,
    tests: (
        app: Application
    ) => void,
) => describe(name, () => {
    const conn = getConnection();

    beforeAll(async() => {
        await conn;
        await (await conn).getRepository(Participant).delete({});
        await (await conn).getRepository(Interview).delete({});

        const participantsRepo = await (await conn).getRepository(Participant);

        // Create and locally store test participants
        PARTICIPANTS = await Promise.all([1,2,3].map((x) => {
            return participantsRepo.create({
                name: `name-${x}`,
                email: `email-${x}@b.com`,
                type: 'Candidate'
            })
        }));

        // Create and locally store test participants
        INTERVIEWERS = await Promise.all([1,2,3].map((x) => {
            return participantsRepo.create({
                name: `name-${x}`,
                email: `email-interviewer-${x}@b.com`,
                type: 'Interviewer'
            })
        }));

        await participantsRepo.save([...PARTICIPANTS, ...INTERVIEWERS]);
    });

    afterAll(async() => {
        await (await conn).close();
    });

    tests(app);
});
