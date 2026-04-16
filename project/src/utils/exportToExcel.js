import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const autoSizeColumns = (rows) => {
  if (!rows?.length) return [];

  const keys = Object.keys(rows[0]);

  return keys.map((key) => {
    const maxLength = Math.max(
      key.length,
      ...rows.map((row) => String(row[key] ?? "").length)
    );

    return { wch: Math.min(maxLength + 2, 30) };
  });
};

export const exportToExcel = ({
  data = [],
  fileName = "Report",
  sheetName = "Sheet1",
}) => {
  if (!data.length) {
    alert("No data available to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!cols"] = autoSizeColumns(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(fileData, `${fileName}.xlsx`);
};