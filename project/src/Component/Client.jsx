// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";

// const Client = () => {
//   const [musculoskeletalClientData, setMusculoskeletalClientData] = useState([]);
//   const [neurologicalClientData, setNeurologicalClientData] = useState([]);
//   const [activeTab, setActiveTab] = useState("neurological");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [musculoRes, neuroRes] = await Promise.all([
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client/getMusculoskeletalClient`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               token: localStorage.getItem("token"),
//             },
//           }),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client/getNeurologicalClient`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               token: localStorage.getItem("token"),
//             },
//           }),
//         ]);

//         const musculoJson = await musculoRes.json();
//         const neuroJson = await neuroRes.json();

//         setMusculoskeletalClientData(musculoJson?.response || []);
//         setNeurologicalClientData(neuroJson?.response || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, []);

// const handleDownload = (data) => {
//   const doc = new jsPDF();

//   doc.setFontSize(16);
//   doc.text("Patient Information", 10, 10);

//   doc.setFontSize(12);
//   let y = 20;

//   Object.entries(data).forEach(([key, value]) => {
//     doc.text(`${key}: ${value}`, 10, y);
//     y += 10;
//   });

//   doc.save(`${data?.patientName || "client"}_data.pdf`);
// };

//   const renderCards = (dataList) => {
//     return dataList.map((data, index) => (
//       <div key={index} className="border rounded-xl p-4 shadow-md mb-4 bg-white">
//         <h2 className="text-xl font-semibold mb-2">{data.patientName || "Unnamed Patient"}</h2>
//         <p><strong>Age:</strong> {data.age}</p>
//         <p><strong>Contact:</strong> {data.contactNumber}</p>
//         <p><strong>Date:</strong> {data.dateOfEvaluation || "N/A"}</p>
//         <button
//           onClick={() => handleDownload(data)}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Download
//         </button>
//       </div>
//     ));
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Client Records</h1>

//       <div className="flex space-x-4 mb-6">
//         <button
//           onClick={() => setActiveTab("neurological")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "neurological" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Neurological
//         </button>
//         <button
//           onClick={() => setActiveTab("musculoskeletal")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "musculoskeletal" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Musculoskeletal
//         </button>
//       </div>

//       <div>
//         {activeTab === "neurological"
//           ? renderCards(neurologicalClientData)
//           : renderCards(musculoskeletalClientData)}
//       </div>
//     </div>
//   );
// };

// export default Client;

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

const Client = () => {
  const [musculoskeletalClientData, setMusculoskeletalClientData] = useState(
    []
  );
  const [neurologicalClientData, setNeurologicalClientData] = useState([]);
  const [obesityClientData, setObesityClientData] = useState([]);
  const [pilatesClientData, setPilatesClientData] = useState([]);
  const [activeTab, setActiveTab] = useState("neurological");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [musculoRes, neuroRes, obesityRes, pilatesRes] =
          await Promise.all([
            fetch(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/client/getMusculoskeletalClient`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.getItem("token"),
                },
              }
            ),
            fetch(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/client/getNeurologicalClient`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.getItem("token"),
                },
              }
            ),
            fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/client/getObesityClient`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.getItem("token"),
                },
              }
            ),
            fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/client/getPilatesClient`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.getItem("token"),
                },
              }
            ),
          ]);

        const musculoJson = await musculoRes.json();
        const neuroJson = await neuroRes.json();
        const obesityJson = await obesityRes.json();
        const pilatesJson = await pilatesRes.json();

        setMusculoskeletalClientData(musculoJson?.response || []);
        setNeurologicalClientData(neuroJson?.response || []);
        setObesityClientData(obesityJson?.response || []);
        setPilatesClientData(pilatesJson?.response || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDownload = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(200, 0, 0);
    doc.text("Akhand Param Dham Physiotherapy Center", pageWidth / 2, y, {
      align: "center",
    });

    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. Mayank Gupta | B.P.T., C. Yoga, C.C.H.", 10, y);
    y += 6;
    doc.text("Consultant Physiotherapist", 10, y);
    y += 6;
    doc.text("Reg. No.: SCH-01/DEG2/25326/2014", 10, y);

    const rawDate = new Date(
      data?.dateOfEvaluation || data?.submittedAt || new Date()
    );
    const date = `${String(rawDate.getDate()).padStart(2, "0")}-${String(
      rawDate.getMonth() + 1
    ).padStart(2, "0")}-${rawDate.getFullYear()}`;
    doc.text(`Date: ${date}`, pageWidth - 60, y);
    y += 10;

    // Divider
    doc.setDrawColor(0);
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Patient Details", 10, y);
    y += 10;

    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    Object.entries(data).forEach(([key, value]) => {
      // Skip unwanted fields
      if (
        key === "_id" ||
        key === "__v" ||
        key === "submittedAt" ||
        value === undefined ||
        value === null ||
        typeof value === "object"
      ) {
        return;
      }

      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

      doc.text(`${formattedKey}: ${value}`, 10, y);
      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Swami Parmanand Netralaya, Near NDPS School, Khandwa Road, Indore",
      pageWidth / 2,
      280,
      {
        align: "center",
      }
    );
    doc.text(
      "Mob: 98276-36538 | Timing: Morning 9–12, Evening 4–6",
      pageWidth / 2,
      286,
      {
        align: "center",
      }
    );

    doc.save(`${data?.patientName || data?.fullName || "client"}_data.pdf`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (id, category) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/client/deleteClient/${category}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (res.ok) {
        alert("Deleted successfully");
        // Refresh the state
        setMusculoskeletalClientData((prev) =>
          prev.filter((item) => item._id !== id)
        );
        setNeurologicalClientData((prev) =>
          prev.filter((item) => item._id !== id)
        );
        setObesityClientData((prev) => prev.filter((item) => item._id !== id));
        setPilatesClientData((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderCards = (dataList, category) => {
    const filteredData = dataList.filter((data) => {
      const name = data.patientName || data.fullName || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filteredData.map((data, index) => (
      <div
        key={index}
        className="border rounded-xl p-4 shadow-md mb-4 bg-white"
      >
        <h2 className="text-xl font-semibold mb-2">
          {data.patientName || data?.fullName || "Unnamed Patient"}
        </h2>
        <p>
          <strong>Age:</strong> {data.age}
        </p>
        <p>
          <strong>Contact:</strong>{" "}
          {data.contactNumber || data.enquiryId?.contactNumber}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {formatDate(data.dateOfEvaluation) ||
            formatDate(data.submittedAt) ||
            "N/A"}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleDownload(data)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download
          </button>

          <button
            onClick={() => handleDelete(data._id, category)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>

          <Link to={`/${category}/${data._id}`}>
            <button
              className={`px-4 py-2 rounded ${
                data?.history?.length >= 2
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
              disabled={false} // still clickable, only style changes
            >
              {data?.history?.length >= 2
                ? "Update limit reached to 2"
                : `Update (${2 - (data?.history?.length || 0)} more time${
                    2 - (data?.history?.length || 0) === 1 ? "" : "s"
                  })`}
            </button>
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Records</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("neurological")}
          className={`px-4 py-2 rounded ${
            activeTab === "neurological"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Neurological
        </button>
        <button
          onClick={() => setActiveTab("musculoskeletal")}
          className={`px-4 py-2 rounded ${
            activeTab === "musculoskeletal"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Musculoskeletal
        </button>
        <button
          onClick={() => setActiveTab("obesity")}
          className={`px-4 py-2 rounded ${
            activeTab === "obesity" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Obesity
        </button>
        <button
          onClick={() => setActiveTab("pilates")}
          className={`px-4 py-2 rounded ${
            activeTab === "pilates" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Pilates
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/2"
        />
      </div>

      <div>
        {activeTab === "neurological" &&
          renderCards(neurologicalClientData, "neurological")}
        {activeTab === "musculoskeletal" &&
          renderCards(musculoskeletalClientData, "musculoskeletal")}
        {activeTab === "obesity" && renderCards(obesityClientData, "obesity")}
        {activeTab === "pilates" && renderCards(pilatesClientData, "pilates")}
      </div>
    </div>
  );
};

export default Client;
