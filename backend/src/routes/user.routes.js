import {Router} from 'express'
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { 
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfilePicture,
    updateAccountDetails,
    changeCurrentUserPassword,
    verifyToken,
    verifyRefreshToken,
 } 
 from '../controllers/user.controller.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser);

router.route("/verifytoken").get(verifyToken);

router.route("/verify-refresh-token").get(verifyRefreshToken);


//secured routes
router.route('/logout').post( verifyJWT, logoutUser )

router.route("/get-current-user").get(verifyJWT, getCurrentUser)

router.route("/update-user-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/change-current-user-password").post(verifyJWT, changeCurrentUserPassword)

router.route("/update-user-profile-picture").patch(verifyJWT, upload.single('profilePicture'), updateUserProfilePicture);



export default router;