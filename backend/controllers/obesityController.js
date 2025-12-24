const ObesityForm = require('../models/ObesityForm');

// @desc    Create a new Obesity Management Form entry
// @route   POST /api/obesity
exports.createObesityForm = async (req, res) => {
  try {
    const form = new ObesityForm(req.body);
    const savedForm = await form.save();
    res.status(201).json({
      message: 'Obesity form successfully submitted',
      data: savedForm,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to submit obesity form',
      error: error.message,
    });
  }
};

// @desc    Get all Obesity Management Form entries
// @route   GET /api/obesity
exports.getAllObesityForms = async (req, res) => {
  try {
    const forms = await ObesityForm.find().sort({ submittedAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch obesity forms',
      error: error.message,
    });
  }
};
