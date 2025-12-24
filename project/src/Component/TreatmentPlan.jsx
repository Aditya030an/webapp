import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const TreatmentPlan = () => {
  const [formData, setFormData] = useState({
    exercises: '',
    progressionStrategy: '',
  });

  const [plans, setPlans] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/treatmentPlan/createTreatmentPlane`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      console.log('result create ', result);
      if (result?.success) {
        alert(result?.message);
      }
      fetchPlans(); // Reload after adding
      setFormData({ exercises: '', progressionStrategy: '' }); // Reset
    } catch (error) {
      console.error('Error creating treatment plan:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/treatmentPlan/getTreatmentPlan`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
        }
      );
      const result = await response.json();
      console.log('response get', result);
      setPlans(result?.data);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

 const handleDownloadPDF = (plan) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Treatment Plan', 20, 20);

  doc.setFontSize(12);

  const marginLeft = 20;
  let currentHeight = 40;

  const exercisesLines = doc.splitTextToSize(`Exercises: ${plan.exercises}`, 170);
  doc.text(exercisesLines, marginLeft, currentHeight);
  currentHeight += exercisesLines.length * 10;

  const strategyLines = doc.splitTextToSize(`Progression Strategy: ${plan.progressionStrategy}`, 170);
  doc.text(strategyLines, marginLeft, currentHeight);
  currentHeight += strategyLines.length * 10;

  const dateLine = `Created At: ${new Date(plan.createdAt).toLocaleString()}`;
  doc.text(dateLine, marginLeft, currentHeight);

  doc.save(`treatment-plan-${plan._id}.pdf`);
};


  return (
    <div className='min-h-screen p-4 bg-gray-100'>
      <div className='max-w-3xl mx-auto bg-white p-4 rounded shadow'>
        <h2 className='text-2xl font-semibold mb-4'>Treatment Plan</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block font-medium'>Exercises / Modalities / Frequency / Duration</label>
            <textarea
              name='exercises'
              value={formData.exercises}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>
          <div>
            <label className='block font-medium'>Progression Strategy</label>
            <textarea
              name='progressionStrategy'
              value={formData.progressionStrategy}
              onChange={handleChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>
          <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
            Submit
          </button>
        </form>
      </div>

      <div className='max-w-7xl mx-auto mt-8'>
        <h3 className='text-xl font-semibold mb-4'>All Treatment Plans</h3>
        {plans?.length === 0 ? (
          <p>No plans found.</p>
        ) : (
          <div className='grid gap-4'>
            {plans?.map((plan) => (
              <div key={plan?._id} className='bg-white p-4 rounded shadow relative'>
                <p><strong>Exercises:</strong> {plan?.exercises}</p>
                <p><strong>Progression:</strong> {plan?.progressionStrategy}</p>
                <p className='text-gray-500 text-sm mb-2'>Created: {new Date(plan.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => handleDownloadPDF(plan)}
                  className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPlan;
