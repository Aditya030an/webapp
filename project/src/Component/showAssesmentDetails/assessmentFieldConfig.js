export const assessmentFieldConfig = {
  Neurological: [
    { label: "Patient Name", key: "patientName" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Occupation", key: "occupation" },
    { label: "Address", key: "address" },
    { label: "Contact Number", key: "contactNumber" },
    { label: "Referred By", key: "referredBy" },
    { label: "Date of Evaluation", key: "dateOfEvaluation", type: "date" },

    // Chief Complaint
    { label: "Chief Complaint", key: "chiefComplaint" },
    { label: "History of Present Illness", key: "historyOfPresentIllness" },
    { label: "Duration of Condition", key: "durationOfCondition" },
    { label: "Onset", key: "onset" },
    { label: "Aggravating Factors", key: "aggravatingFactors" },

    // Medical History
    { label: "Past Medical History", key: "pastMedicalHistory" },
    { label: "Surgical History", key: "surgicalHistory" },
    { label: "Family History", key: "familyHistory" },
    { label: "Obstetric History", key: "obstetricHistory" },
    { label: "Personal History", key: "personalHistory" },
    { label: "MRI Reports", key: "mriReports" },

    // Observation
    { label: "Posture", key: "posture" },
    { label: "Gait", key: "gait" },
    { label: "Build & Nutrition", key: "buildNutrition" },
    { label: "Deformities", key: "deformities" },
    { label: "Scars", key: "scars" },
    { label: "Tenderness", key: "tenderness" },

    // Pain Assessment
    { label: "Pain Site", key: "painSite" },
    { label: "Pain Type", key: "painType" },
    { label: "VAS Score", key: "vasScore" },

    // Tone & Reflexes
    { label: "MAS", key: "mas" },
    { label: "Clonus", key: "clonus" },
    { label: "MMT", key: "mmt" },
    { label: "Superficial Reflexes", key: "superficialReflexes" },
    { label: "Deep Reflexes", key: "deepReflexes" },
    { label: "Pathological Reflexes", key: "pathologicalReflexes" },

    // Coordination & Sensory
    { label: "Coordination", key: "coordination" },
    { label: "Cranial Nerve Examination", key: "cranialNerveExamination" },
    { label: "Superficial Sensations", key: "superficialSensations" },
    { label: "Deep Sensations", key: "deepSensations" },
    { label: "Cortical Sensations", key: "corticalSensations" },

    // Functional Assessment
    { label: "Bed Mobility", key: "bedMobility" },
    { label: "Gait Pattern", key: "gaitPattern" },
    { label: "Balance", key: "balance" },
    { label: "Assistive Devices", key: "assistiveDevices" },
    { label: "ADLs", key: "adls" },

    // Cognitive & Psychological
    { label: "Orientation", key: "orientation" },
    { label: "Memory", key: "memory" },
    { label: "Speech", key: "speech" },
    { label: "Perception", key: "perception" },
    { label: "Mood", key: "mood" },
    { label: "Family Support", key: "familySupport" },

    // Outcome & Goals
    { label: "FIM Scores", key: "fimScores" },
    { label: "Outcome Measures", key: "outcomeMeasures" },
    { label: "Problem List", key: "problemList" },
    { label: "Short Term Goals", key: "shortTermGoals" },
    { label: "Long Term Goals", key: "longTermGoals" },
    { label: "Follow Up", key: "followUp" },

    // Consent & Signatures
    { label: "Patient Consent", key: "patientConsent" },
    { label: "Patient Signature", key: "patientSignature" },
    { label: "Physiotherapist Name", key: "physiotherapistName" },
    { label: "Physiotherapist Signature", key: "physiotherapistSignature" },
    { label: "Physiotherapist Date", key: "datePhysiotherapist", type: "date" },
    { label: "Patient Date", key: "datePatient", type: "date" },
  ],
  Musculoskeletal: [
    /* ===== Patient Info ===== */
    { label: "Patient Name", key: "patientName" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Occupation", key: "occupation" },
    { label: "Address", key: "address" },
    { label: "Contact Number", key: "contactNumber" },
    { label: "Referred By", key: "referredBy" },
    { label: "Date of Evaluation", key: "dateOfEvaluation", type: "date" },

    /* ===== Clinical History ===== */
    { label: "Chief Complaint", key: "chiefComplaint" },
    { label: "History of Present Illness", key: "historyOfPresentIllness" },
    { label: "Duration of Condition", key: "durationOfCondition" },
    { label: "Onset", key: "onset" },
    { label: "Aggravating Factors", key: "aggravatingFactors" },
    { label: "Medical History", key: "medicalHistory" },
    { label: "Surgical History", key: "surgicalHistory" },
    { label: "Family History", key: "familyHistory" },
    { label: "Personal History", key: "personalHistory" },

    /* ===== Observation ===== */
    { label: "Posture", key: "posture" },
    { label: "Scars", key: "scars" },
    { label: "Tenderness", key: "tenderness" },
    { label: "Temperature", key: "temperature" },

    /* ===== Pain Assessment ===== */
    { label: "Type of Pain", key: "typeOfPain" },
    { label: "Site of Pain", key: "siteOfPain" },
    { label: "Pain Duration", key: "duration" },
    { label: "VAS Score", key: "vasScore" },

    /* ===== Movement Examination ===== */
    { label: "Joint ROM", key: "jointROM" },
    { label: "Pain During Movement", key: "painDuringMovement" },
    { label: "MMT", key: "mmt" },
    { label: "Muscle Weakness", key: "muscleWeakness" },
    { label: "Specific Tests", key: "mentionSpecificTests" },

    /* ===== Functional Assessment ===== */
    { label: "Gait", key: "gait" },
    { label: "Assistive Devices", key: "assistiveDevices" },
    { label: "Functional Independence", key: "functionalIndependence" },
    { label: "X-Ray / Imaging", key: "xray" },

    /* ===== Assessment & Plan ===== */
    {
      label: "Summary of Clinical Problems",
      key: "summarizeClinicalProblems",
    },
    { label: "Short Term Goals", key: "shortTermGoals" },
    { label: "Long Term Goals", key: "longTermGoals" },

    /* ===== Consent & Signature ===== */
    { label: "Patient Consent", key: "patientConsent" },
    { label: "Physiotherapist Name", key: "physiotherapistName" },
    { label: "Signature", key: "signature" },
    { label: "Date", key: "date", type: "date" },
  ],

  "Obesity Management": [
    // Basic Details
    { label: "Full Name", key: "fullName" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Height", key: "height" },
    { label: "Weight", key: "weight" },
    { label: "BMI", key: "bmi" },

    // Medical Details
    { label: "Medical History", key: "medicalHistory" },

    // Girth Measurements
    { label: "Arm Girth", key: "armGirth" },
    { label: "Thigh Girth", key: "thighGirth" },
    { label: "Chest", key: "chest" },
    { label: "Abdomen (Umbilicus)", key: "abdomenUmbilicus" },
    { label: "Abdomen (Xiphoid)", key: "abdomenXiphoid" },
    { label: "Abdomen (ASIS)", key: "abdomenAsis" },

    // Weight Chart (List / Table)
    {
      label: "Weight Chart",
      key: "weightChart",
      type: "table",
      columns: [
        { label: "Date", key: "date", type: "date" },
        { label: "Before Weight", key: "before" },
        { label: "After Weight", key: "after" },
      ],
    },

    // Summary
    { label: "Summary", key: "summary" },
  ],

  Pilates: [
    { label: "Full Name", key: "fullName" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },

    { label: "Medical History", key: "medicalHistory" },

    { label: "Exercise Frequency", key: "exerciseFrequency" },
    { label: "Exercise Type", key: "exerciseType" },

    { label: "Pilates Goals", key: "pilatesGoals" },

    { label: "Posture Notes", key: "postureNotes" },
    { label: "Pain Areas", key: "painAreas" },

    { label: "Physiotherapist Summary", key: "physiotherapistSummary" },
  ],
  "Treatment Plan": [
    {label:"Exercises"  , key:"exercises"},
    {label:"Progression Strategy"  , key:"progressionStrategy"},
  ],
};
