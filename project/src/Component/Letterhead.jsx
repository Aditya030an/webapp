import React from "react";

const Letterhead = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 border shadow-md text-[14px] print:p-0 print:shadow-none print:border-none print:text-black">
      {/* Header */}
      <div className="text-center border-b pb-2 mb-4">
        <h1 className="text-xl font-bold text-red-700 uppercase">
          Akhand Param Dham Physiotherapy Center
        </h1>
        <div className="flex justify-between items-start mt-2 text-gray-800 text-sm">
          <div>
            <p className="font-semibold text-gray-800">Dr. Mayank Gupta</p>
            <p>B.P.T., C. Yoga, C.C.H.</p>
            <p>Consultant Physiotherapist</p>
            <p>Reg. No.: SCH-01/DEG2/25326/2014</p>
          </div>
          <img
            src="/logo-placeholder.png"
            alt="Clinic Logo"
            className="w-16 h-16 object-contain"
          />
          <div className="text-right">
            <p>Date: ___________________</p>
          </div>
        </div>
      </div>

      {/* Body / Content Section */}
      <div className="min-h-[400px] relative">
        <div className="absolute inset-0 flex justify-center items-center opacity-10">
          <img
            src="/caduceus-placeholder.png"
            alt="Medical symbol"
            className="h-64 object-contain"
          />
        </div>
        <div className="relative z-10">
          <p className="mb-2">No.: _______________________</p>
          {/* Add more fields as needed for patient details, diagnosis, etc. */}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t pt-2 text-center text-xs text-gray-600">
        <p>
          Swami Parmanand Netralaya, Near NDPS School, Khandwa Road, Indore
        </p>
        <p>
          Mob: <span className="font-semibold">98276-36538</span> | Time:
          Morning: 9 to 12, Evening: 4 to 6
        </p>
      </div>
    </div>
  );
};

export default Letterhead;