import React from "react";

const EnquiryInfoSection = ({enquiryId}) => {
  return (
    <section className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Enquiry Information</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <b>Source:</b> {enquiryId?.source}
        </p>
        <p>
          <b>Status:</b> {enquiryId?.enquiryStatus}
        </p>
        <p>
          <b>Payment:</b> {enquiryId?.paymentStatus}
        </p>
        <p>
          <b>Total Amount:</b> ₹{enquiryId?.total}
        </p>
        <p>
          <b>Days:</b> {enquiryId?.numberOfDays}
        </p>
        <p>
          <b>Amount/Day:</b> ₹{enquiryId?.amountPerDay}
        </p>
      </div>
    </section>
  );
};

export default EnquiryInfoSection;
