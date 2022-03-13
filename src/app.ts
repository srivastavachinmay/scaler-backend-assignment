import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import interviewRoutes from './routes/interview-routes';
import participantRoutes from './routes/participants-routes';
import RequestError from "./middlewares/request-error";
import { ErrorWithCode } from "./interfaces/error-with-code";
import cors from 'cors';

// create express app
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/interview', interviewRoutes);
app.use('/api/participant', participantRoutes);

//Unsupported Routes
app.use(() => {
    throw new RequestError('Cannot find this Route!', 404);
})

//Error Handling for any other error
app.use((error: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
    if ( req.file ) {
        fs.unlink(req.file.path, (err: any) => {
            console.log(err);
        });
    }
    if ( res.headersSent ) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        "status": "failed",
        "message": error.message || 'An unknown error occurred!'
    });
});

export default app;
