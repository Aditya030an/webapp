


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const NavigationTabs = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("webapptoken");

  const logout = () => {
    localStorage.removeItem("webapptoken");
    navigate("/auth");
  };

  const tabs = [
    { name: "Enquiry", path: "/" },
    { name: "Assessment", isDropdown: true },
    { name: "Client", path: "/client" },
    { name: "Reports", path: "/Reports" },
    { name: "Attendence", path: "/Attendence" },
  ];

  const assessmentItems = [
    { name: "Neurological", path: "/assessment" },
    { name: "Musculoskeletal", path: "/musculoskeletal" },
    { name: "Obesity Management", path: "/obesity" },
    { name: "Pilates", path: "/pilates" },
    { name: "Treatment Plan", path: "/treatmentPlan" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-2xl font-extrabold text-gray-800">
          Movement Rehab
        </span>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-semibold">
          {tabs.map((tab, index) =>
            tab.isDropdown ? (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="text-gray-700 hover:text-blue-600">
                  Assessment
                </button>

                {dropdownOpen && (
                  <div className="absolute top-10 left-0 bg-white border rounded shadow-lg w-56 z-50">
                    {assessmentItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                to={tab.path}
                className="text-gray-700 hover:text-blue-600"
              >
                {tab.name}
              </Link>
            )
          )}
        </div>

        {/* Auth / Logout buttons */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="text-blue-600">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {tabs.map((tab, index) =>
              tab.isDropdown ? (
                <div key={index}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full text-left text-gray-700 hover:text-blue-600"
                  >
                    Assessment
                  </button>
                  {dropdownOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      {assessmentItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="block text-gray-700 hover:text-blue-600 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  to={tab.path}
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tab.name}
                </Link>
              )
            )}

            {/* Auth / Logout buttons in mobile */}
            <div className="pt-2 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationTabs;
