import ConvertToPatientForm from "./ConvertToPatientForm";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EnquiryPdfDocument from "./pdf/EnquiryPdfDocument";

const AllEnquiry = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [enquiries, setEnquiries] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [patientStatus, setPatientStatus] = useState("all");
  const [showConvertToPatientForm, setShowConvertToPatientForm] =
    useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deletingEnquiryId, setDeletingEnquiryId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    enquiryId: "",
    patientId: "",
    enquiryStatus: "",
    patientStatus: "true",
    remark: "",
  });

  const [savingEdit, setSavingEdit] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const tabs = ["all", "lead", "patient"];

  const fetchAllEnquiries = async () => {
    try {
      const response = await fetch(`${backendURL}/api/enquiry/getEnquiry`);
      const result = await response.json();
      setEnquiries(result?.enquiries || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  useEffect(() => {
    const employeeData = localStorage.getItem("loginEmployeeData");

    if (!employeeData) {
      setIsAdmin(false);
      return;
    }

    try {
      const employee = JSON.parse(employeeData);
      const loggedInEmail = employee?.personalDetails?.email
        ?.trim()
        ?.toLowerCase();
      const adminEmail =
        import.meta.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase();

      setIsAdmin(loggedInEmail === adminEmail);
    } catch (error) {
      console.error("Failed to parse loginEmployeeData:", error);
      setIsAdmin(false);
    }
  }, []);

  const getFilteredEnquiries = () => {
    let filtered = [...enquiries];

    if (activeStatus === "lead") {
      filtered = filtered.filter((e) => e.enquiryStatus === "lead");
    } else if (activeStatus === "patient") {
      filtered = filtered.filter((e) => e.enquiryStatus === "patient");
    }

    if (patientStatus !== "all") {
      filtered = filtered.filter((e) => {
        const status = e?.patientId?.personalDetails?.patientStatus;

        if (patientStatus === "active") return status === true;
        if (patientStatus === "inactive") return status === false;

        return true;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((item) => {
        const nameMatch = item?.patientName?.toLowerCase().includes(term);
        const phoneMatch = item?.contactNumber?.includes(term);
        const patientIdMatch = item?.patientId?.personalDetails?.patientId
          ?.toLowerCase()
          .includes(term);

        return nameMatch || phoneMatch || patientIdMatch;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const normalizeEnquiryData = (data) => {
    return data.map((item, index) => ({
      "S.No": index + 1,
      "Enquiry ID": item?._id || "",
      "Type": item?.enquiryStatus || "",
      "Patient Status":
        item?.enquiryStatus === "patient"
          ? item?.patientId?.personalDetails?.patientStatus
            ? "Active"
            : "Inactive"
          : "-",
      "Patient Code": item?.patientId?.personalDetails?.patientId || "-",
      "Name": item?.patientName || "",
      "Gender": item?.gender || "",
      "Age": item?.age ?? "",
      "Occupation": item?.occupation || "",
      "Contact Number": item?.contactNumber || "",
      "Email": item?.email || "",
      "Chief Complaint": item?.chiefComplaint || "",
      "Remark": item?.remark || "",
      "Response": item?.response || "",
      "Source": item?.source || "",
      "Address": item?.patientId?.personalDetails?.address || "-",
      "Attendance Count": item?.patientId?.attendance?.length || 0,
      "Billing Count": item?.patientId?.billing?.length || 0,
      "Treatment Count": item?.patientId?.treatment?.length || 0,
      "Created Date": item?.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "",
      "Created Time": item?.createdAt
        ? new Date(item.createdAt).toLocaleTimeString()
        : "",
      "Updated Date": item?.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString()
        : "",
    }));
  };

  const getSummaryStats = (data) => {
    const total = data.length;
    const leads = data.filter((item) => item.enquiryStatus === "lead").length;
    const patients = data.filter(
      (item) => item.enquiryStatus === "patient"
    ).length;
    const activePatients = data.filter(
      (item) =>
        item.enquiryStatus === "patient" &&
        item?.patientId?.personalDetails?.patientStatus === true
    ).length;
    const inactivePatients = data.filter(
      (item) =>
        item.enquiryStatus === "patient" &&
        item?.patientId?.personalDetails?.patientStatus === false
    ).length;
    const conversionRate = total > 0 ? ((patients / total) * 100).toFixed(2) : 0;

    return {
      total,
      leads,
      patients,
      activePatients,
      inactivePatients,
      conversionRate,
    };
  };

  const getExportFileName = (type) => {
    const date = new Date().toISOString().split("T")[0];
    const statusPart = activeStatus || "all";
    const patientFilterPart =
      activeStatus === "patient" ? `-${patientStatus}` : "";
    const searchPart = searchTerm?.trim()
      ? `-${searchTerm.trim().replace(/\s+/g, "-")}`
      : "";

    return `enquiry-${statusPart}${patientFilterPart}${searchPart}-${date}.${type}`;
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);

      const filteredData = getFilteredEnquiries();
      const normalizedData = normalizeEnquiryData(filteredData);
      const stats = getSummaryStats(filteredData);

      const workbook = XLSX.utils.book_new();

      const summaryData = [
        ["Enquiry Report Summary"],
        [],
        ["Total Enquiries", stats.total],
        ["Total Leads", stats.leads],
        ["Total Patients", stats.patients],
        ["Active Patients", stats.activePatients],
        ["Inactive Patients", stats.inactivePatients],
        ["Conversion Rate (%)", stats.conversionRate],
        [],
        ["Applied Filters"],
        ["Enquiry Type Filter", activeStatus],
        ["Patient Status Filter", patientStatus],
        ["Search Term", searchTerm || "-"],
        ["Sort By", sortBy],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

      const dataSheet = XLSX.utils.json_to_sheet(normalizedData);
      XLSX.utils.book_append_sheet(workbook, dataSheet, "Enquiries");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, getExportFileName("xlsx"));
    } catch (error) {
      console.error("Excel download failed:", error);
      alert("Failed to download Excel");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);

      const filteredData = getFilteredEnquiries();
      const stats = getSummaryStats(filteredData);

      const blob = await pdf(
        <EnquiryPdfDocument
          enquiries={filteredData}
          stats={stats}
          activeStatus={activeStatus}
          patientStatus={patientStatus}
          searchTerm={searchTerm}
          sortBy={sortBy}
        />
      ).toBlob();

      saveAs(blob, getExportFileName("pdf"));
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const openEditModal = (entry) => {
    setSelectedEnquiry(entry);
    setEditData({
      enquiryId: entry?._id || "",
      patientId: entry?.patientId?._id || "",
      enquiryStatus: entry?.enquiryStatus || "lead",
      patientStatus: entry?.patientId?.personalDetails?.patientStatus
        ? "true"
        : "false",
      remark: entry?.remark || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedEnquiry(null);
    setEditData({
      enquiryId: "",
      patientId: "",
      enquiryStatus: "",
      patientStatus: "true",
      remark: "",
    });
  };

  const handleConvertToPatient = async (data) => {
    const confirmConvert = window.confirm(
      "Are you sure you want to convert this enquiry into patient?"
    );

    if (!confirmConvert) return;

    try {
      const payload = {
        ...data,
        enquiryId: selectedEnquiry?._id,
      };

      const response = await fetch(`${backendURL}/api/patient/createPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result?.success) {
        alert("Patient created successfully");
        fetchAllEnquiries();
        setShowConvertToPatientForm(false);
        closeEditModal();
      } else {
        alert(result?.message || "Failed to convert to patient");
      }
    } catch (error) {
      console.error("Convert to patient failed", error);
      alert("Something went wrong");
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSavingEdit(true);

      const response = await fetch(
        `${backendURL}/api/patient/updatePatientStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enquiryId: editData.enquiryId,
            patientId: editData.patientId || null,
            patientStatus:
              editData.enquiryStatus === "patient"
                ? editData.patientStatus === "true"
                : undefined,
            remark: editData.remark,
          }),
        }
      );

      const result = await response.json();

      if (result?.success) {
        alert("Updated successfully");
        fetchAllEnquiries();
        closeEditModal();
      } else {
        alert(result?.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating enquiry/patient:", error);
      alert("Something went wrong");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingEnquiryId(enquiryId);

      const response = await fetch(
        `${backendURL}/api/enquiry/deleteEnquiryById/${enquiryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("webapptoken"),
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        alert("Enquiry deleted successfully");
        fetchAllEnquiries();
        closeEditModal();
      } else {
        alert(result?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete enquiry failed", error);
      alert("Something went wrong");
    } finally {
      setDeletingEnquiryId(null);
    }
  };

  const filteredEnquiries = getFilteredEnquiries();

  return (
    <div className="px-6">
      <div className="flex flex-wrap gap-4 mt-10 mb-4 items-center">
        {tabs?.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4 py-2 rounded ${
              activeStatus === s ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
        <p className="text-black font-semibold">
          Total Enquiry :-{" "}
          <span className="text-gray-600">{filteredEnquiries?.length}</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or patient ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {activeStatus === "patient" && (
          <select
            value={patientStatus}
            onChange={(e) => setPatientStatus(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4"
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf || filteredEnquiries.length === 0}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60"
        >
          {downloadingPdf ? "Downloading PDF..." : "Download PDF"}
        </button>

        <button
          onClick={handleDownloadExcel}
          disabled={downloadingExcel || filteredEnquiries.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {downloadingExcel ? "Downloading Excel..." : "Download Excel"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEnquiries.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium text-gray-600">
              No enquiries match your filters
            </p>
            <p className="text-sm text-gray-400">
              Try changing filters or search keywords
            </p>
          </div>
        ) : (
          filteredEnquiries.map((entry) => (
            <div
              key={entry._id}
              className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              {isAdmin && (
                <button
                  onClick={() => openEditModal(entry)}
                  className="absolute top-3 right-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
              )}

              <div className="mb-2 pr-16">
                {entry.enquiryStatus === "patient" && (
                  <div className="mb-2 space-y-2">
                    <p className="text-xs text-gray-500">
                      Patient ID:{" "}
                      <span className="font-medium">
                        {entry.patientId?.personalDetails?.patientId}
                      </span>
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        Status:{" "}
                        <span
                          className={
                            entry?.patientId?.personalDetails?.patientStatus
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {entry?.patientId?.personalDetails?.patientStatus
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="font-semibold text-gray-800 text-base">
                  <span>Name- </span>
                  <span className="text-sm text-gray-500">
                    {entry?.patientName}
                  </span>
                </h3>

                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Contact number-</span>{" "}
                  {entry?.contactNumber}
                </p>

                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Remark-</span>{" "}
                  {entry?.remark || "_______"}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                <span className="font-medium text-gray-700">Complaint:</span>{" "}
                {entry.chiefComplaint || "-"}
              </p>

              <div className="flex items-center justify-between">
                {entry.enquiryStatus === "lead" ? (
                  <span className="text-sm font-medium text-yellow-600">
                    ● Lead
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">
                      ● Patient
                    </span>
                    <Link
                      to={`/PatientDetails/${entry?.patientId?._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showEditModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Enquiry</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={selectedEnquiry?.patientName || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Remark</label>
                <textarea
                  rows={4}
                  value={editData.remark}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      remark: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Update remark"
                />
              </div>

              {editData.enquiryStatus === "patient" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Patient Status
                  </label>
                  <select
                    value={editData.patientStatus}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        patientStatus: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
                >
                  {savingEdit ? "Saving..." : "Update"}
                </button>

                {selectedEnquiry?.enquiryStatus === "lead" && (
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setShowConvertToPatientForm(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Convert to Patient
                  </button>
                )}

                <button
                  onClick={() => handleDeleteEnquiry(selectedEnquiry?._id)}
                  disabled={deletingEnquiryId === selectedEnquiry?._id}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {deletingEnquiryId === selectedEnquiry?._id && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConvertToPatientForm && (
        <ConvertToPatientForm
          selectedEnquiry={selectedEnquiry}
          onClose={() => {
            setShowConvertToPatientForm(false);
            setShowEditModal(true);
          }}
          onSubmit={handleConvertToPatient}
        />
      )}
    </div>
  );
};

export default AllEnquiry;