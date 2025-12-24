import express from "express";

import auth from "../middleware/auth.js";
import {createEnquiry , getEnquiry, getPersonalDetails} from "../controllers/enquiryController.js";

const enquiryRouter = express.Router();

enquiryRouter.post("/createEnquiry" , createEnquiry );
enquiryRouter.get("/getEnquiry" , getEnquiry );
enquiryRouter.get("/getPersonalDetails" , auth , getPersonalDetails );

export default enquiryRouter;