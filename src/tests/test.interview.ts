import { describeWithApp, INTERVIEWERS, PARTICIPANTS } from "./test-setup";
import request from "supertest";
import { IInterview } from "../entity/Interview";

describeWithApp("Interview", (app) => {

    const createInterview = async (data?: IInterview) => {
        const now = new Date()
        const end = new Date()
        end.setHours(now.getHours() + 1)
        const res = await request(app)
            .put("/api/interview")
            .send(data ?? {
                startDateTime: now,
                endDateTime: end,
                participants: [...PARTICIPANTS.map(x => x.email), INTERVIEWERS.map(x => x.email)![0]!],
            } as IInterview & { participants: string[] })
        return { interview: res.body, res }
    }

    it('should create an interview', async () => {
        const { res } = await createInterview()
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBeDefined()
    });

    it('should update an interview', async () => {
        const { interview } = await createInterview()
        expect(interview.id).toBeDefined()

        const now = new Date()
        const end = new Date()
        end.setHours(now.getHours() + 1)

        const res = await request(app)
        .put("/api/interview")
        .send({
            id: interview.id,
            startDateTime: now,
            endDateTime: end,
            participants: [PARTICIPANTS.map(x => x.email)![0]!, PARTICIPANTS.map(x => x.email)![1]!],
        } as IInterview & { participants: string[] })

        // expect(res.statusCode).toBe(200)
        expect(res.body.id).toBeDefined()
    });

    it('should get all interviews', async () => {
        await createInterview()
        const res = await request(app)
            .get("/api/interview")
        
        expect(res.statusCode).toBe(200)
        expect(res.body.interviews).toBeDefined()
        expect(res.body.interviews).toHaveLength(3)
    });

    it('should fail to schodeule interview without an interviewer', async() => {
        const { res } = await createInterview()
        expect(res.statusCode).toBe(400)
    })

    it('should fail to schodeule interview due to slot unavailablity', async() => {
        const now = new Date()
        const end = new Date()
        end.setHours(now.getHours() + 1)

        const { res } = await createInterview({
            startDateTime: now,
            endDateTime: end,
            participants: [PARTICIPANTS.map(x => x.email)![0]!, PARTICIPANTS.map(x => x.email)![1]!],
        } as IInterview & { participants: string[] })
        expect(res.statusCode).toBe(200)

        const { res: newRes } = await createInterview({
            startDateTime: now,
            endDateTime: end,
            participants: [PARTICIPANTS.map(x => x.email)![0]!, PARTICIPANTS.map(x => x.email)![0]!],
        } as IInterview & { participants: string[] })

        expect(newRes.statusCode).toBe(400)
    })
});
