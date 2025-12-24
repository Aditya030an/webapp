import express from 'express';
import { createTreatmentPlan, getTreatmentPlans } from '../controllers/TreatmentPlanController.js';

const router = express.Router();

router.post('/createTreatmentPlane', createTreatmentPlan);
router.get('/getTreatmentPlan', getTreatmentPlans);

export default router;
