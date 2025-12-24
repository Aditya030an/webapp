import express from "express";
import {getNeurologicalClient , getMusculoskeletalClient , getObesityClient , getPilatesClient} from "../controllers/clientController.js";
import auth from "../middleware/auth.js";
const clientRouter = express.Router();

clientRouter.get("/getNeurologicalClient",auth,getNeurologicalClient);
clientRouter.get("/getMusculoskeletalClient",auth ,getMusculoskeletalClient );
clientRouter.get("/getObesityClient",auth ,getObesityClient );
clientRouter.get("/getPilatesClient",auth ,getPilatesClient );

export default clientRouter;