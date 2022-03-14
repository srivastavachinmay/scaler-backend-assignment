import { describeWithApp, INTERVIEWERS, PARTICIPANTS } from "./test-setup";
import request from "supertest";
import { IInterview } from "../entity/Interview";

describeWithApp("Interview", (app) => {

    let TOTAL_INTERVIEWS = 0
    const createInterview = async (data?: IInterview & { participants: string[] }) => {
        const now = new Date()
        const end = new Date()

        end.setHours(now.getHours() + 1)

        const res = await request(app)
            .put("/api/interview")
            .send(data ?? {
                startDateTime: now,
                endDateTime: end,
                participants: [ ...PARTICIPANTS.map(x => x.email), INTERVIEWERS.map(x => x.email)![0]! ],
            } as IInterview & { participants: string[] })
        TOTAL_INTERVIEWS += 1;
        return { interview: res.body, res }
    }

    it('should create an interview', async () => {
        const { res } = await createInterview();
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
    });

    it('should update an interview', async () => {
        const initialNow = new Date();
        const initialEnd = new Date();
        initialNow.setHours(initialNow.getHours() - 3);
        initialEnd.setHours(initialEnd.getHours() - 2);

        const participants = [ PARTICIPANTS.map(x => x.email)![0]!, INTERVIEWERS.map(x => x.email)![1]! ];

        const { res: initialRes } = await createInterview({
            startDateTime: initialNow,
            endDateTime: initialEnd,
            participants
        });

        const interview = initialRes.body;

        expect(interview.id).toBeDefined();

        const now = new Date()
        const end = new Date()
        now.setHours(now.getHours() + 2);
        end.setHours(now.getHours() + 3);

        const res = await request(app)
            .put("/api/interview")
            .send({
                id: interview.id,
                startDateTime: now,
                endDateTime: end,
                participants,
            } as IInterview & { participants: string[] });

        expect(res.body.id).toBeDefined();
    });

    it('should get all interviews', async () => {
        const res = await request(app).get("/api/interview");

        expect(res.statusCode).toBe(200);
        expect(res.body.interviews).toBeDefined();
        expect(res.body.interviews).toHaveLength(TOTAL_INTERVIEWS);
    });

    it('should fail to schedule interview without an interviewer', async() => {
        const now = new Date()
        const end = new Date()
        end.setHours(now.getHours() + 1)

        const { res } = await createInterview({
            startDateTime: now,
            endDateTime: end,
            participants: [...PARTICIPANTS.map(x => x.email)],
        });

        expect(res.statusCode).toBe(400)
    })

    it('should fail to schedule interview due to slot unavailability', async() => {
        const now = new Date()
        const end = new Date()
        now.setHours(now.getHours() + 6)
        end.setHours(now.getHours() + 7)

        const { res } = await createInterview({
            startDateTime: now,
            endDateTime: end,
            participants: [PARTICIPANTS.map(x => x.email)![0]!, INTERVIEWERS.map(x => x.email)![1]!],
        } as IInterview & { participants: string[] })

        expect(res.statusCode).toBe(200)

        const { res: newRes } = await createInterview({
            startDateTime: now,
            endDateTime: end,
            participants: [PARTICIPANTS.map(x => x.email)![0]!, INTERVIEWERS.map(x => x.email)![0]!],
        } as IInterview & { participants: string[] })

        expect(newRes.statusCode).toBe(400)
    })
});
