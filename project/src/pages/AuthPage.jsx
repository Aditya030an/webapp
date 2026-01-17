import { useState } from "react";
import AuthModal from "../Component/AuthModal";
import { useNavigate } from "react-router-dom";

const AuthPage = ({setRole}) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <AuthModal
          onClose={() => {}}
          onAuthSuccess={() => {
            navigate("/");
          }}
          setRole={setRole}
        />
      </div>
    </div>
  );
};

export default AuthPage;
