import nodemailer from 'nodemailer'
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

let transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : false,
    auth : {
        user : process.env.SMTP_MAIL, 
        pass : process.env.SMTP_PASS
    }
})

const sendEmailHandler = asyncHandler(
    async (req,res)=>{
        const {email, subject, message} = req.body
        // console.log(email, subject, message);

        const mailOptions = {
            from : process.env.SMTP_MAIL,
            to : email.toLowerCase(),
            subject : subject,
            text : message
        }
        // console.log(mailOptions);
        try {
            transporter.sendMail(mailOptions, function(error, info){
                if (error){
                    throw new ApiError(500, "Something went wrong while sending verification code on email. Try again", error)
                }
                else if (info){
                    return res
                    .status(200)
                    .json(
                        new ApiResponse(200, {}, "Sent Successfully")
                        )
                    }
                })
        } catch (error) {
            throw new ApiError(500, "Something went wrong while sending verification code")
        }

    }
)

export {sendEmailHandler}