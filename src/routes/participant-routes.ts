import * as express from "express";
import { getParticipants } from "../controller/participant/get-participants";

const router = express.Router();

router.get('/', getParticipants);

export default router;
