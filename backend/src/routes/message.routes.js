import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getAllMessagesBetweenTwoUsers } from "../controllers/message.controller.js";

const router = Router()

router.route('/getmessages/:user1Id/:user2Id').get( verifyJWT, getAllMessagesBetweenTwoUsers )

export default router;