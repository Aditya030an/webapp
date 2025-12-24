


import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavigationTabs = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { name: 'Enquiry', path: '/' },
    { name: 'Assessment', path: '', isDropdown: true },
    { name: 'Client', path: '/client' },
    { name: 'Reports', path: '/Reports' },
    { name: 'Attendence', path: '/Attendence' },
  ];

  const assessmentItems = [
    { name: 'Neurological', path: '/assessment' },
    { name: 'Musculoskeletal', path: 'musculoskeletal' },
    { name: 'Obesity Management', path: 'Obesity' },
    { name: 'Pilates', path: 'Pilates' },
    { name: 'Treatment Plan', path: 'TreatmentPlan' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          {/* <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" /> */}
          <span className="text-2xl font-extrabold text-gray-800">Movement Rehab</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg font-semibold">
          {tabs.map((tab, index) =>
            tab.isDropdown ? (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="text-gray-700 hover:text-blue-600 transition duration-200">
                  {tab.name}
                </button>

                <div
                  className={`absolute top-10 left-0 bg-white border rounded shadow-lg z-50 w-56 transition-all duration-200 ${
                    dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                >
                  {assessmentItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={index}
                to={tab.path}
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                {tab.name}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;