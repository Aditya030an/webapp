import express from "express";

import auth from "../middleware/auth.js";
import {
  createNeurologicalForm,
  createMusculoskeletalForm,
  createPilatesForm,
  createObesityForm,
    getNeurologicalForm,
    getMusculoskeletalForm,
    getObesityForm,
    getPilatesForm,
    updateNeurologicalForm,
    updateMusculoskeletalForm,
    updateObesityForm,
    updatePilatesForm,
} from "../controllers/assessmentController.js";
import employeeAuth from "../middleware/employeeAuth.js";

const assessmentRouter = express.Router();

// assessmentRouter.post("/neurological", auth, createNeurologicalForm);
assessmentRouter.post("/neurological", employeeAuth, createNeurologicalForm);
assessmentRouter.post("/musculoskeletal", createMusculoskeletalForm);
assessmentRouter.post("/obesity", createObesityForm);
assessmentRouter.post("/pilates", createPilatesForm);

// get router
assessmentRouter.get("/getneurological/:id", auth, getNeurologicalForm);
assessmentRouter.get("/getmusculoskeletal/:id", auth, getMusculoskeletalForm);
assessmentRouter.get("/getobesity/:id", auth, getObesityForm);
assessmentRouter.get("/getpilates/:id", auth, getPilatesForm);

// update router
assessmentRouter.put("/updateNeurological/:id", auth, updateNeurologicalForm);
assessmentRouter.put("/updateMusculoskeletal/:id", auth, updateMusculoskeletalForm);
assessmentRouter.put("/updateObesity/:id", auth, updateObesityForm);
assessmentRouter.put("/updatePilates/:id", auth, updatePilatesForm);

export default assessmentRouter;
