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
    verifyAccessToken,
    verifyRefreshToken,
    verifyEmail,
    changePasswordByCode,
    getUserByUsername,
    getCurrentUserWishlist,
    deleteUser,
} 
from '../controllers/user.controller.js';
import { sendEmailHandler } from '../controllers/email.controller.js';

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

router.route("/verifyemail").post(verifyEmail);

router.route("/sendemail").post(sendEmailHandler);

router.route("/verifytoken").get(verifyAccessToken);

router.route("/verify-refresh-token").get(verifyRefreshToken);

router.route("/change-password-bycode").post(changePasswordByCode);

router.route("/getuser/username/:username").get(getUserByUsername);


//secured routes
router.route('/logout').post( verifyJWT, logoutUser )

router.route("/get-current-user").get( verifyJWT, getCurrentUser )

router.route("/currentuser-wishlist").get( verifyJWT, getCurrentUserWishlist );

router.route("/update-user-account-details").patch( verifyJWT, updateAccountDetails )

router.route("/change-current-user-password").post( verifyJWT, changeCurrentUserPassword )

router.route("/update-user-profile-picture").patch( verifyJWT, upload.single('profilePicture'), updateUserProfilePicture );

router.route("/deleteuser").delete(verifyJWT , deleteUser)



export default router;