  import mongoose from "mongoose";

  const neurologicalFormSchema = new mongoose.Schema(
    {
      patientName: String,
      age: String,
      gender: String,
      occupation: String,
      address: String,
      contactNumber: String,
      referredBy: String,
      dateOfEvaluation: String,
      chiefComplaint: String,
      historyOfPresentIllness: String,
      durationOfCondition: String,
      onset: String,
      aggravatingFactors: String,
      pastMedicalHistory: String,
      surgicalHistory: String,
      familyHistory: String,
      obstetricHistory: String,
      personalHistory: String,
      mriReports: String,
      posture: String,
      gait: String,
      buildNutrition: String,
      deformities: String,
      scars: String,
      tenderness: String,
      painSite: String,
      painType: String,
      vasScore: Number,
      mas: String,
      clonus: String,
      mmt: String,
      superficialReflexes: String,
      deepReflexes: String,
      pathologicalReflexes: String,
      coordination: String,
      cranialNerveExamination: String,
      superficialSensations: String,
      deepSensations: String,
      corticalSensations: String,
      bedMobility: String,
      gaitPattern: String,
      balance: String,
      assistiveDevices: String,
      adls: String,
      orientation: String,
      memory: String,
      speech: String,
      perception: String,
      mood: String,
      familySupport: String,
      fimScores: String,
      outcomeMeasures: String,
      problemList: String,
      shortTermGoals: String,
      longTermGoals: String,
      followUp: String,
      patientConsent: String,
      patientSignature: String,
      physiotherapistName: String,
      physiotherapistSignature: String,
      datePhysiotherapist: String,
      datePatient: String,
      // enquiryId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "enquiry",
      //   required: true,
      // },
      patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient",
        required:true
      },
      history: [
        {
          updatedAt: { type: Date, default: Date.now },
          data: { type: mongoose.Schema.Types.Mixed }, // <- key fix
        },
      ],
    },
    { timestamps: true }
  );

  const neurologicalForm = mongoose.model(
    "neurologicalForm",
    neurologicalFormSchema
  );

  export default neurologicalForm;
