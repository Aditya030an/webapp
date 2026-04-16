import express from "express";
import {createPatient , getAllPatient , getPatientById , updatedPatientStatus} from "../controllers/patientController.js";


const patientRouter = express.Router();

patientRouter.post("/createPatient", createPatient);
patientRouter.get("/getAllPatient", getAllPatient);
patientRouter.get("/getPatientById/:id", getPatientById);

patientRouter.put("/updatePatientStatus" , updatedPatientStatus)

export default patientRouter;