import * as express from 'express';
import { check } from 'express-validator';
import { createInterview }                 from "../controller/interview/create-interview";
import { getInterviewById, getInterviews } from "../controller/interview/get-interviews";
import { singleFileUpload }                from "../middlewares/file-upload";

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

router.get('/:id',getInterviewById )

export default router;
