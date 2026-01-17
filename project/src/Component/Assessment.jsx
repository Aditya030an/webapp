import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";

const NeuroPhysioFullForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location?.state?.patient;
  const patientDetail = location?.state?.patient?.personalDetails;
  const patient_id = location?.state?.patient?._id;
  console.log("patient inside the neuro", patient);
  // console.log("patient details inside the neuro", patientDetail);
  // console.log("patient  inside the neuro", patient_id);

  const { id } = useParams(); // If present => update mode
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    occupation: "",
    address: "",
    contactNumber: "",
    referredBy: "",
    dateOfEvaluation: "",
    chiefComplaint: "",
    historyOfPresentIllness: "",
    durationOfCondition: "",
    onset: "",
    aggravatingFactors: "",
    pastMedicalHistory: "",
    surgicalHistory: "",
    familyHistory: "",
    obstetricHistory: "",
    personalHistory: "",
    mriReports: "",
    posture: "",
    gait: "",
    buildNutrition: "",
    deformities: "",
    scars: "",
    tenderness: "",
    painSite: "",
    painType: "",
    vasScore: 0,
    mas: "",
    clonus: "",
    mmt: "",
    superficialReflexes: "",
    deepReflexes: "",
    pathologicalReflexes: "",
    coordination: "",
    cranialNerveExamination: "",
    superficialSensations: "",
    deepSensations: "",
    corticalSensations: "",
    bedMobility: "",
    gaitPattern: "",
    balance: "",
    assistiveDevices: "",
    adls: "",
    orientation: "",
    memory: "",
    speech: "",
    perception: "",
    mood: "",
    familySupport: "",
    fimScores: "",
    outcomeMeasures: "",
    problemList: "",
    shortTermGoals: "",
    longTermGoals: "",
    followUp: "",
    patientConsent: "",
    patientSignature: "",
    physiotherapistName: "",
    physiotherapistSignature: "",
    datePhysiotherapist: "",
    datePatient: "",
  });

  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const activeTab = "Neurological";

  useEffect(() => {
    const employee = localStorage.getItem("loginEmployeeData");
    const data = JSON.parse(employee);
    console.log("data", data);
    setFormData((prev) => ({
      ...prev,
      physiotherapistName: data?.personalDetails?.fullName,
    }));
  }, []);

  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const pickAllowedFields = (source, allowedKeys) => {
    const result = {};
    allowedKeys.forEach((key) => {
      if (source[key] !== undefined) {
        result[key] = source[key];
      }
    });
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (patientDetail) {
      setFormData((prev) => ({
        ...prev,
        patientName: patientDetail.name,
        age: patientDetail.age,
        gender: patientDetail.gender,
        occupation: patientDetail?.enquiryId?.occupation,
        address: patientDetail?.address,
        contactNumber: patientDetail?.contactNumber,
        chiefComplaint: patientDetail?.chiefComplaint,
      }));
    }
  }, [patientDetail]);

  useEffect(() => {
    const forms = patient?.assessment?.neurologicalFormId;

    if (forms?.length) {
      const lastForm = forms[forms.length - 1];

      const allowedKeys = Object.keys(formData);

      const filteredData = pickAllowedFields(lastForm, allowedKeys);
      console.log("filteredData", filteredData);
      setFormData((prev) => ({
        ...prev,
        ...filteredData,
      }));

      setActiveRecords([...forms].reverse());
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      patientId: patient_id,
      formData: formData,
    };
    setLoading(true);
    try {
      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/assessment/neurological`;

      const method = "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("webapptoken"),
        },
        body: JSON.stringify(payLoad),
      });

      const result = await response.json();
      console.log("result , , ,, ,", result);
      if (result?.success) {
        alert(result?.message);
        setHistory(result?.updatedForm?.history);
        setFormData({
          patientName: "",
          age: "",
          gender: "",
          occupation: "",
          address: "",
          contactNumber: "",
          referredBy: "",
          dateOfEvaluation: "",
          chiefComplaint: "",
          historyOfPresentIllness: "",
          durationOfCondition: "",
          onset: "",
          aggravatingFactors: "",
          pastMedicalHistory: "",
          surgicalHistory: "",
          familyHistory: "",
          obstetricHistory: "",
          personalHistory: "",
          mriReports: "",
          posture: "",
          gait: "",
          buildNutrition: "",
          deformities: "",
          scars: "",
          tenderness: "",
          painSite: "",
          painType: "",
          vasScore: 0,
          mas: "",
          clonus: "",
          mmt: "",
          superficialReflexes: "",
          deepReflexes: "",
          pathologicalReflexes: "",
          coordination: "",
          cranialNerveExamination: "",
          superficialSensations: "",
          deepSensations: "",
          corticalSensations: "",
          bedMobility: "",
          gaitPattern: "",
          balance: "",
          assistiveDevices: "",
          adls: "",
          orientation: "",
          memory: "",
          speech: "",
          perception: "",
          mood: "",
          familySupport: "",
          fimScores: "",
          outcomeMeasures: "",
          problemList: "",
          shortTermGoals: "",
          longTermGoals: "",

          followUp: "",
          patientConsent: "",
          patientSignature: "",
          physiotherapistName: "",
          physiotherapistSignature: "",
          datePhysiotherapist: "",
          datePatient: "",
        });
        navigate(`/PatientDetails/${patient_id}`);
      } else {
        alert(result?.message);
      }
    } catch (error) {
      console.log("error inside the nero", error);
      alert("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>History</h2>
        {activeRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No {activeTab} records</p>
        ) : (
          <ul className="text-sm list-disc ml-5 p-2">
            {activeRecords?.map((item, index) => (
              <li
                key={item?._id}
                onClick={() => {
                  setSelectedRecord(item);
                  setOpenModal(true);
                }}
                className="cursor-pointer "
              >
                {activeTab} Assessment #{index + 1} -{" "}
                {formatDateTime(item?.createdAt)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-6 py-10 bg-white shadow-lg rounded-xl space-y-10"
      >
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          Neurological Physiotherapy Evaluation Form
        </h1>

        {/* Patient Information */}
        <Section title="Patient Information">
          <Grid>
            <Input
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Referred By Doctor"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
            />
            <Input
              label="Date of Evaluation"
              name="dateOfEvaluation"
              type="date"
              value={formData.dateOfEvaluation}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* Presenting Complaints */}
        <Section title="Presenting Complaints">
          <Textarea
            label="Chief Complaints"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            readOnly={true}
          />
          <Textarea
            label="History of Present Illness"
            name="historyOfPresentIllness"
            value={formData.historyOfPresentIllness}
            onChange={handleChange}
          />
          <Textarea
            label="Duration of Condition"
            name="durationOfCondition"
            value={formData.durationOfCondition}
            onChange={handleChange}
          />
          <Textarea
            label="Onset (Sudden/Gradual)"
            name="onset"
            value={formData.onset}
            onChange={handleChange}
          />
          <Textarea
            label="Aggravating/Relieving Factors"
            name="aggravatingFactors"
            value={formData.aggravatingFactors}
            onChange={handleChange}
          />
        </Section>

        {/* Medical History */}
        <Section title="Medical, Surgical & Personal History">
          <Textarea
            label="Past Medical History"
            name="pastMedicalHistory"
            value={formData.pastMedicalHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Surgical History"
            name="surgicalHistory"
            value={formData.surgicalHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Family History"
            name="familyHistory"
            value={formData.familyHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Obstetric History"
            name="obstetricHistory"
            value={formData.obstetricHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Personal History"
            name="personalHistory"
            value={formData.personalHistory}
            onChange={handleChange}
          />
        </Section>

        {/* Investigation Reports */}
        <Section title="Investigation Reports">
          <Textarea
            label="MRI / CT / EEG / Others"
            name="mriReports"
            value={formData.mriReports}
            onChange={handleChange}
          />
        </Section>

        {/* Observation/Inspection */}
        <Section title="Observation / Inspection">
          <Grid>
            <Input
              label="Posture"
              name="posture"
              value={formData.posture}
              onChange={handleChange}
            />
            <Input
              label="Gait"
              name="gait"
              value={formData.gait}
              onChange={handleChange}
            />
            <Input
              label="Build & Nutrition"
              name="buildNutrition"
              value={formData.buildNutrition}
              onChange={handleChange}
            />
            <Input
              label="Deformities / Contractures"
              name="deformities"
              value={formData.deformities}
              onChange={handleChange}
            />
            <Input
              label="Scars / Swelling / Atrophy"
              name="scars"
              value={formData.scars}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* Palpation */}
        <Section title="Palpation">
          <Textarea
            label="Tenderness / Swelling / Muscle Tone"
            name="tenderness"
            value={formData.tenderness}
            onChange={handleChange}
          />
        </Section>

        {/* Pain Assessment */}
        <Section title="Pain Assessment">
          <Grid>
            <Input
              label="Pain Site"
              name="painSite"
              value={formData.painSite}
              onChange={handleChange}
            />
            <Input
              label="Pain Type (e.g., Sharp, Dull)"
              name="painType"
              value={formData.painType}
              onChange={handleChange}
            />
          </Grid>

          <label className="block font-medium mt-2 mb-1">
            VAS Score <span className="ml-2">{formData.vasScore}</span>
          </label>

          <input
            type="range"
            min="0"
            max="10"
            value={formData.vasScore}
            onChange={(e) =>
              setFormData({ ...formData, vasScore: e.target.value })
            }
            className="w-full"
          />
        </Section>

        {/* Tone Evaluation */}
        <Section title="Tone Evaluation">
          <Textarea
            label="MAS (Modified Ashworth Scale)"
            name="mas"
            value={formData.mas}
            onChange={handleChange}
          />
          <Textarea
            label="Clonus / Rigidity / Flaccidity"
            name="clonus"
            value={formData.clonus}
            onChange={handleChange}
          />
        </Section>

        {/* Muscle Strength (Power) */}
        <Section title="Muscle Strength (Power)">
          <Textarea
            label="MMT (Manual Muscle Testing) with Grades"
            name="mmt"
            value={formData.mmt}
            onChange={handleChange}
          />
        </Section>

        {/* Reflexes */}
        <Section title="Reflexes">
          <Textarea
            label="Superficial Reflexes (Abdominal, Cremasteric)"
            name="superficialReflexes"
            value={formData.superficialReflexes}
            onChange={handleChange}
          />
          <Textarea
            label="Deep Reflexes (Biceps, Triceps, Knee, Ankle)"
            name="deepReflexes"
            value={formData.deepReflexes}
            onChange={handleChange}
          />
          <Textarea
            label="Pathological Reflexes (Babinski, Hoffmann's)"
            name="pathologicalReflexes"
            value={formData.pathologicalReflexes}
            onChange={handleChange}
          />
        </Section>

        {/* Coordination */}
        <Section title="Coordination">
          <Textarea
            label="Finger-Nose, Heel-Shin, Dysdiadochokinesia"
            name="coordination"
            value={formData.coordination}
            onChange={handleChange}
          />
        </Section>

        {/* Cranial Nerve Examination */}
        <Section title="Cranial Nerve Examination">
          <Textarea
            label="Assessment of all 12 Cranial Nerves"
            name="cranialNerveExamination"
            value={formData.cranialNerveExamination}
            onChange={handleChange}
          />
        </Section>

        {/* Sensory System */}
        <Section title="Sensory System">
          <Textarea
            label="Superficial Sensations (Touch, Pain, Temp)"
            name="superficialSensations"
            value={formData.superficialSensations}
            onChange={handleChange}
          />
          <Textarea
            label="Deep Sensations (Proprioception, Vibration)"
            name="deepSensations"
            value={formData.deepSensations}
            onChange={handleChange}
          />
          <Textarea
            label="Cortical Sensations (Stereognosis, Graphesthesia)"
            name="corticalSensations"
            value={formData.corticalSensations}
            onChange={handleChange}
          />
        </Section>

        {/* Functional Measures */}
        <Section title="Functional Measures">
          <Textarea
            label="Bed Mobility / Transfers / Wheelchair Mobility"
            name="bedMobility"
            value={formData.bedMobility}
            onChange={handleChange}
          />
          <Textarea
            label="Gait Pattern (Assistance, Deviation)"
            name="gaitPattern"
            value={formData.gaitPattern}
            onChange={handleChange}
          />
          <Textarea
            label="Balance (Static / Dynamic)"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
          />
          <Textarea
            label="Use of Assistive Devices"
            name="assistiveDevices"
            value={formData.assistiveDevices}
            onChange={handleChange}
          />
          <Textarea
            label="Activities of Daily Living (ADLs)"
            name="adls"
            value={formData.adls}
            onChange={handleChange}
          />
        </Section>

        {/* Higher Mental Functions */}
        <Section title="Higher Mental Functions">
          <Textarea
            label="Orientation (Time, Place, Person)"
            name="orientation"
            value={formData.orientation}
            onChange={handleChange}
          />
          <Textarea
            label="Memory (Immediate, Recent, Remote)"
            name="memory"
            value={formData.memory}
            onChange={handleChange}
          />
          <Textarea
            label="Speech & Comprehension"
            name="speech"
            value={formData.speech}
            onChange={handleChange}
          />
          <Textarea
            label="Perception, Judgment, Attention"
            name="perception"
            value={formData.perception}
            onChange={handleChange}
          />
        </Section>

        {/* Psychological Status */}
        <Section title="Psychological Status">
          <Textarea
            label="Mood, Behavior, Anxiety, Depression"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
          />
          <Textarea
            label="Family Support / Coping Strategies"
            name="familySupport"
            value={formData.familySupport}
            onChange={handleChange}
          />
        </Section>

        {/* Functional Independence Measures (FIM) */}
        <Section title="Functional Independence Measures (FIM)">
          <Textarea
            label="Scores & Observations"
            name="fimScores"
            value={formData.fimScores}
            onChange={handleChange}
          />
        </Section>

        {/* Outcome Measures */}
        <Section title="Outcome Measures">
          <Textarea
            label="Berg Balance Scale, Barthel Index, Others"
            name="outcomeMeasures"
            value={formData.outcomeMeasures}
            onChange={handleChange}
          />
        </Section>

        {/* Problem List */}
        <Section title="Problem List">
          <Textarea
            label="List All Functional / Physical Problems"
            name="problemList"
            value={formData.problemList}
            onChange={handleChange}
          />
        </Section>

        {/* Treatment Goals */}
        <Section title="Treatment Goals">
          <Textarea
            label="Short Term Goals"
            name="shortTermGoals"
            value={formData.shortTermGoals}
            onChange={handleChange}
          />
          <Textarea
            label="Long Term Goals"
            name="longTermGoals"
            value={formData.longTermGoals}
            onChange={handleChange}
          />
        </Section>

        {/* Follow-up / Progress */}
        <Section title="Follow-up & Progress Notes">
          <Textarea
            label="Follow-up Observations & Plan"
            name="followUp"
            value={formData.followUp}
            onChange={handleChange}
          />
        </Section>

        {/* Consent */}
        <Section title="Consent & Signature">
          <Textarea
            label="Patient Consent / Remarks"
            name="patientConsent"
            value={formData.patientConsent}
            onChange={handleChange}
          />
          <Grid>
            <Input
              label="Patient Signature"
              name="patientSignature"
              value={formData.patientSignature}
              onChange={handleChange}
            />
            <Input
              label="Date"
              type="date"
              name="datePatient"
              value={formData.datePatient}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <Input
              label="Physiotherapist Name"
              name="physiotherapistName"
              value={formData.physiotherapistName}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Signature"
              name="physiotherapistSignature"
              value={formData.physiotherapistSignature}
              onChange={handleChange}
            />
            <Input
              label="Date"
              type="date"
              name="datePhysiotherapist"
              value={formData.datePhysiotherapist}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* Submit Button */}

        <div className="text-center space-y-3">
          {id && (
            <>
              {history?.length >= 2 ? (
                <div className="text-red-600 font-semibold">
                  No update possible. Maximum update limit (2) reached.
                </div>
              ) : (
                <div className="text-green-600 font-semibold">
                  {2 - (history?.length || 0)} update
                  {2 - (history?.length || 0) === 1 ? " is" : "s are"}{" "}
                  remaining.
                </div>
              )}
            </>
          )}

          <div className="space-x-4">
            <button
              type="submit"
              disabled={(id && history?.length >= 2) || loading}
              className={`${
                id
                  ? history?.length >= 2
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white px-8 py-3 rounded-lg transition`}
            >
              {id
                ? loading
                  ? "Updating..."
                  : "Update Evaluation"
                : loading
                  ? "Submitting..."
                  : "Submit Evaluation"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <AssessmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRecord}
        title={`${activeTab} Assessment`}
        assessmentType={activeTab}
        onDownloadPdf={() => {
          console.log("Download PDF for", activeTab, selectedRecord);
        }}
      />
    </div>
  );
};

export default NeuroPhysioFullForm;

// --- Helper Components ---
const Section = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h2>
    {children}
  </section>
);

const Input = ({ label, type = "text", name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <input
      type={type}
      placeholder={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <textarea
      placeholder={label}
      rows={3}
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);
