import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getProductbyCategory, getProductbyId } from "../controllers/product.controller.js";

const router = Router()

router.route('/addproduct').post(
    verifyJWT,
    upload.fields([
        {
            name : "thumbNail",
            maxCount : 1
        },
        {
            name : "extraImage",
            maxCount : 1
        }
    ]),
    addProduct
)

router.route("/getproduct/:id").get(getProductbyId)

router.route("/getproduct/category/:category").get(getProductbyCategory)

router.route('/deleteproduct/:id').delete(verifyJWT, deleteProduct)


export default router