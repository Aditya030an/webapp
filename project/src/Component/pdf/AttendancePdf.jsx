import { Document } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";
import PdfAttendanceContent from "./PdfAttendanceContent";

const AttendancePdf = ({ attendance, patientDetail }) => (
  <Document>
    <PdfTemplate>
      <PdfAttendanceContent
        attendance={attendance}
        patientDetail={patientDetail}
      />
    </PdfTemplate>
  </Document>
);

export default AttendancePdf;
