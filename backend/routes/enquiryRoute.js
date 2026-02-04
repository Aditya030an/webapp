import express from "express";

import auth from "../middleware/auth.js";
import {createEnquiry , getEnquiry, getPersonalDetails, deleteEnquiryById} from "../controllers/enquiryController.js";
import employeeAuth from "../middleware/employeeAuth.js";

const enquiryRouter = express.Router();

enquiryRouter.post("/createEnquiry" , createEnquiry );
enquiryRouter.get("/getEnquiry" , getEnquiry );
enquiryRouter.get("/getPersonalDetails" , auth , getPersonalDetails );
enquiryRouter.delete("/deleteEnquiryById/:id" , employeeAuth , deleteEnquiryById );

export default enquiryRouter;