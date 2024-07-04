import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getProducts, getProductbyId, sellProduct } from "../controllers/product.controller.js";
import { addWish, deleteWish } from "../controllers/wish.controller.js";
// import { addRating } from "../controllers/rating.controller.js";
// import { addReview } from "../controllers/review.controller.js";

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

router.route("/getproducts").get( getProducts )

router.route("/getproductbyId/:id").get(getProductbyId)

router.route("/sellproduct/:id").patch(verifyJWT, sellProduct)

router.route('/deleteproduct/:id').delete(verifyJWT, deleteProduct)

router.route('/addwish/:id').post(verifyJWT, addWish);

router.route('/deletewish/:id').delete(verifyJWT, deleteWish)

// router.route('/addrating').post(verifyJWT, addRating);

// router.route('/addreview').post(verifyJWT, addReview);

export default router