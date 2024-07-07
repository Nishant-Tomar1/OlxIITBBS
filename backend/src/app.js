import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,
//     credentials : true
// }))
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))
app.use(express.static("build"))
app.use(cookieParser())
app.use(bodyParser.json())

// app.get('/', ( __, res) => {
//     res.send('Working Successfully')
//   })

//routes
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import messageRouter from "./routes/message.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/messages", messageRouter)

export {app}

