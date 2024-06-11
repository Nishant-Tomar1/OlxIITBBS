import {Router} from 'express'
import {upload} from "../middlewares/auth.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/register").post(
    upload.single("profileImage"),
    registerUser
)

export default router;