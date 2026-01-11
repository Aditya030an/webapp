import PdfTemplate from "./PdfTemplate";
import PdfAssessmentContent from "./PdfAssessmentContent";

const AssessmentPdf = ({ data, assessmentType }) => {
  return (
    <PdfTemplate>
      <PdfAssessmentContent
        data={data}
        assessmentType={assessmentType}
      />
    </PdfTemplate>
  );
};

export default AssessmentPdf;
