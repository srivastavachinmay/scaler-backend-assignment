import { describeWithApp, INTERVIEWERS, PARTICIPANTS } from "./test-setup";
import request from "supertest";
import { IInterview } from "../entity/Interview";

describeWithApp("Participant", (app) => {
    it('should get all participants', async () => {
        const res = await request(app).get("/api/participant")

        expect(res.statusCode).toBe(200);
        expect(res.body.participants).toBeDefined();
    });
});
