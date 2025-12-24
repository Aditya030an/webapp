import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDb from "./config/mongodb.js";
import enquiryRouter from "./routes/enquiryRoute.js";
import assessmentRouter from "./routes/assesmentRoute.js";
import clientRouter from "./routes/clientRoute.js";
import reportRouter from "./routes/reportRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import treatmentPlanRouter from "./routes/treatmentPlanRoute.js";

//App config
const app = express();
const port = process.env.PORT || 8080;
connectDb();


//middewares

app.use(express.json());
app.use(cors({
  origin: "*"
}));



//api end points
app.use("/api/enquiry" , enquiryRouter);
app.use("/api/assessment" , assessmentRouter);
app.use("/api/client" , clientRouter);
app.use("/api/report" , reportRouter);
app.use("/api/employee" , employeeRouter);
app.use("/api/treatmentPlan" , treatmentPlanRouter);

app.get("/" ,(req , res)=>{
    res.send("API working")
})

app.listen(port , ()=>{
    console.log("server started on PORT:" + port)
})