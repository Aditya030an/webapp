import express from "express";
import {createPatient , getAllPatient , getPatientById} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/createPatient", createPatient);
patientRouter.get("/getAllPatient", getAllPatient);
patientRouter.get("/getPatientById/:id", getPatientById);

export default patientRouter;