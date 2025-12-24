import TreatmentPlan from '../models/treatmentPlanModels.js';

// @desc   Create a new treatment plan
// @route  POST /api/treatment-plans
export const createTreatmentPlan = async (req, res) => {
  try {
    const { exercises, progressionStrategy } = req.body;

    const newPlan = new TreatmentPlan({ exercises, progressionStrategy });
    await newPlan.save();

    res.status(201).json({ success: true,message: 'Treatment plan created successfully', data: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// @desc   Get all treatment plans
// @route  GET /api/treatment-plans
export const getTreatmentPlans = async (req, res) => {
  try {
    const plans = await TreatmentPlan.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
