import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

const NavigationTabs = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // login | signup | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("webapptoken"));
  }, []);

  const logout = () => {
    localStorage.removeItem("webapptoken");
    setIsLoggedIn(false);
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
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-extrabold text-gray-800">
            Movement Rehab
          </span>

          <div className="flex items-center space-x-8 text-lg font-semibold">
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
                    <div className="absolute top-10 left-0 bg-white border rounded shadow-lg w-56">
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

            {/* AUTH BUTTONS */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setAuthModal("login")}
                  className="text-blue-600"
                >
                  Login
                </button>
                
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL */}
      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onAuthSuccess={() => setIsLoggedIn(true)}
          onSwitchType={(type) => setAuthModal(type)}
        />
      )}
    </>
  );
};

export default NavigationTabs;
