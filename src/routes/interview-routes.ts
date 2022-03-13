import * as express from 'express';
import { check } from 'express-validator';
import { createInterview } from "../controller/create-interview";
import { getInterviews } from "../controller/get-interviews";
import { singleFileUpload } from "../middlewares/file-upload";

const router = express.Router();

router.put('/',
    [
        check("startDateTime").not().isEmpty(),
        check("endDateTime").not().isEmpty(),
        check("participants").not().isEmpty(),
        singleFileUpload('resumes', "resume"),
    ],
    createInterview);

router.get('/', getInterviews);

export default router;
