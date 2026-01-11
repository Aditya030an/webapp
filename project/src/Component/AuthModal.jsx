import { useState } from "react";
import fetchApi from "../api/fetchApi";
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AuthModal = ({ type, onClose, onAuthSuccess, onSwitchType }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading , setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        type === "login"
          ? "/api/user/loginUser"
          : "/api/user/createUser";

      const data = await fetchApi(url, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (data?.token) {
        localStorage.setItem("webapptoken", data.token);
      }

      onAuthSuccess();
      onClose();
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg p-6 md:p-8 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <AiOutlineClose size={22} />
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4 capitalize text-center">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {type === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          {/* Password Field with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
            {type === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Switch Login / Signup */}
        <p className="text-sm text-center mt-4">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => onSwitchType("signup")}
                className="text-blue-600 font-medium"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => onSwitchType("login")}
                className="text-blue-600 font-medium"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
