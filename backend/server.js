import express from "express"
import dontenv from "dotenv"
import connectDB from "./database/db.js"
import errorHandler from "./middleware/error.js"
import router from "./routes/auth.js"
dontenv.config()

//database connection
connectDB()

//Mount express
const app = express()
app.use(express.json())
app.use("/api/v1", router)

//middleware
app.use(errorHandler);
const port = process.env.PORT
const node_env = process.env.NODE_ENV
app.listen(port, () => {
  console.log(`The server is running in ${node_env} mode in ${port}`);
});