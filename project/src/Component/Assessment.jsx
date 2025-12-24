import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NeuroPhysioFullForm = () => {
  const { id } = useParams(); // If present => update mode
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    sex: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        if (id) {
          const dataResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/assessment/getneurological/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
            }
          );
          const dataResult = await dataResponse.json();
          console.log("data", dataResult);
          if (dataResult.success && dataResult.form) {
            setFormData((prev) => ({
              ...prev,
              ...dataResult.form, // This will spread all matching keys into formData
            }));
            setHistory(dataResult?.form?.history);
          }
        } else {
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/enquiry/getPersonalDetails`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
            }
          );
          const result = await response.json();
          const data = result?.enquiryPersonalDetails?.[0];
          console.log(data);
          setFormData((prev) => ({
            ...prev,
            patientName: data?.patientName,
            age: data?.age,
            sex: data?.sex,
            occupation: data?.occupation,
            contactNumber: data?.contactNumber,
            chiefComplaint: data?.chiefComplaint,
          }));
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchPersonalDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = id
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/api/assessment/updateNeurological/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/assessment/neurological`;

      const method = id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        alert(result.message);
        setHistory(result?.updatedForm?.history);
        setFormData({
          patientName: "",
          age: "",
          sex: "",
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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">History</h1>
        {history?.length === 0 ? (
          <p>No history found</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{index + 1} </strong> <strong>Updated At:</strong>{" "}
                {new Date(item?.updatedAt).toLocaleString("en-IN")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Patient Name:</strong> {item?.data?.patientName}
                  </p>
                  <p>
                    <strong>Age:</strong> {item?.data?.age}
                  </p>
                  <p>
                    <strong>Sex:</strong> {item?.data?.sex}
                  </p>
                  <p>
                    <strong>Occupation:</strong> {item?.data?.occupation}
                  </p>
                  <p>
                    <strong>Address:</strong> {item?.data?.address}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {item?.data?.contactNumber}
                  </p>
                  <p>
                    <strong>Referred By:</strong> {item?.data?.referredBy}
                  </p>
                  <p>
                    <strong>Date Of Evaluation:</strong>{" "}
                    {item?.data?.dateOfEvaluation}
                  </p>
                  <p>
                    <strong>Chief Complaint:</strong>{" "}
                    {item?.data?.chiefComplaint}
                  </p>
                  <p>
                    <strong>History Of Present Illness:</strong>{" "}
                    {item?.data?.historyOfPresentIllness}
                  </p>
                  <p>
                    <strong>Duration Of Condition:</strong>{" "}
                    {item?.data?.durationOfCondition}
                  </p>
                  <p>
                    <strong>Onset:</strong> {item?.data?.onset}
                  </p>
                  <p>
                    <strong>Aggravating Factors:</strong>{" "}
                    {item?.data?.aggravatingFactors}
                  </p>
                  <p>
                    <strong>Past Medical History:</strong>{" "}
                    {item?.data?.pastMedicalHistory}
                  </p>
                  <p>
                    <strong>Surgical History:</strong>{" "}
                    {item?.data?.surgicalHistory}
                  </p>
                  <p>
                    <strong>Family History:</strong> {item?.data?.familyHistory}
                  </p>
                  <p>
                    <strong>Obstetric History:</strong>{" "}
                    {item?.data?.obstetricHistory}
                  </p>
                  <p>
                    <strong>Personal History:</strong>{" "}
                    {item?.data?.personalHistory}
                  </p>
                  <p>
                    <strong>MRI Reports:</strong> {item?.data?.mriReports}
                  </p>
                  <p>
                    <strong>Posture:</strong> {item?.data?.posture}
                  </p>
                  <p>
                    <strong>Gait:</strong> {item?.data?.gait}
                  </p>
                  <p>
                    <strong>Build Nutrition:</strong>{" "}
                    {item?.data?.buildNutrition}
                  </p>
                  <p>
                    <strong>Deformities:</strong> {item?.data?.deformities}
                  </p>
                  <p>
                    <strong>Scars:</strong> {item?.data?.scars}
                  </p>
                  <p>
                    <strong>Tenderness:</strong> {item?.data?.tenderness}
                  </p>
                  <p>
                    <strong>Pain Site:</strong> {item?.data?.painSite}
                  </p>
                  <p>
                    <strong>Pain Type:</strong> {item?.data?.painType}
                  </p>
                  <p>
                    <strong>VAS Score:</strong> {item?.data?.vasScore}
                  </p>
                  <p>
                    <strong>MAS:</strong> {item?.data?.mas}
                  </p>
                  <p>
                    <strong>Clonus:</strong> {item?.data?.clonus}
                  </p>
                  <p>
                    <strong>MMT:</strong> {item?.data?.mmt}
                  </p>
                  <p>
                    <strong>Superficial Reflexes:</strong>{" "}
                    {item?.data?.superficialReflexes}
                  </p>
                  <p>
                    <strong>Deep Reflexes:</strong> {item?.data?.deepReflexes}
                  </p>
                  <p>
                    <strong>Pathological Reflexes:</strong>{" "}
                    {item?.data?.pathologicalReflexes}
                  </p>
                  <p>
                    <strong>Coordination:</strong> {item?.data?.coordination}
                  </p>
                  <p>
                    <strong>Cranial Nerve Examination:</strong>{" "}
                    {item?.data?.cranialNerveExamination}
                  </p>
                  <p>
                    <strong>Superficial Sensations:</strong>{" "}
                    {item?.data?.superficialSensations}
                  </p>
                  <p>
                    <strong>Deep Sensations:</strong>{" "}
                    {item?.data?.deepSensations}
                  </p>
                  <p>
                    <strong>Cortical Sensations:</strong>{" "}
                    {item?.data?.corticalSensations}
                  </p>
                  <p>
                    <strong>Bed Mobility:</strong> {item?.data?.bedMobility}
                  </p>
                  <p>
                    <strong>Gait Pattern:</strong> {item?.data?.gaitPattern}
                  </p>
                  <p>
                    <strong>Balance:</strong> {item?.data?.balance}
                  </p>
                  <p>
                    <strong>Assistive Devices:</strong>{" "}
                    {item?.data?.assistiveDevices}
                  </p>
                  <p>
                    <strong>ADLs:</strong> {item?.data?.adls}
                  </p>
                  <p>
                    <strong>Orientation:</strong> {item?.data?.orientation}
                  </p>
                  <p>
                    <strong>Memory:</strong> {item?.data?.memory}
                  </p>
                  <p>
                    <strong>Speech:</strong> {item?.data?.speech}
                  </p>
                  <p>
                    <strong>Perception:</strong> {item?.data?.perception}
                  </p>
                  <p>
                    <strong>Mood:</strong> {item?.data?.mood}
                  </p>
                  <p>
                    <strong>Family Support:</strong> {item?.data?.familySupport}
                  </p>
                  <p>
                    <strong>FIM Scores:</strong> {item?.data?.fimScores}
                  </p>
                  <p>
                    <strong>Outcome Measures:</strong>{" "}
                    {item?.data?.outcomeMeasures}
                  </p>
                  <p>
                    <strong>Problem List:</strong> {item?.data?.problemList}
                  </p>
                  <p>
                    <strong>Short Term Goals:</strong>{" "}
                    {item?.data?.shortTermGoals}
                  </p>
                  <p>
                    <strong>Long Term Goals:</strong>{" "}
                    {item?.data?.longTermGoals}
                  </p>
                  <p>
                    <strong>Follow Up:</strong> {item?.data?.followUp}
                  </p>
                  <p>
                    <strong>Patient Consent:</strong>{" "}
                    {item?.data?.patientConsent}
                  </p>
                  <p>
                    <strong>Patient Signature:</strong>{" "}
                    {item?.data?.patientSignature}
                  </p>
                  <p>
                    <strong>Physiotherapist Name:</strong>{" "}
                    {item?.data?.physiotherapistName}
                  </p>
                  <p>
                    <strong>Physiotherapist Signature:</strong>{" "}
                    {item?.data?.physiotherapistSignature}
                  </p>
                  <p>
                    <strong>Date Physiotherapist:</strong>{" "}
                    {item?.data?.datePhysiotherapist}
                  </p>
                  <p>
                    <strong>Date Patient:</strong> {item?.data?.datePatient}
                  </p>
                </div>
              </div>
            </div>
          ))
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
              //readOnly={true}
            />
            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              //readOnly={true}
            />
            <Input
              label="Sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              //readOnly={true}
            />
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              //readOnly={true}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              //readOnly={true}
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
            //readOnly={true}
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
          <label className="block font-medium mt-2 mb-1">VAS Score</label>
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
              disabled={id && history?.length >= 2}
              className={`${
                id
                  ? history?.length >= 2
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white px-8 py-3 rounded-lg transition`}
            >
              {id ? "Update Evaluation" : "Submit Evaluation"}
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
