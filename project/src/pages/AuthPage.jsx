import { useState } from "react";
import AuthModal from "../Component/AuthModal";

const AuthPage = () => {
  const [type, setType] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <AuthModal
          type={type}
          onClose={() => {}}
          onAuthSuccess={() => {
            window.location.href = "/";
          }}
          onSwitchType={(t) => setType(t)}
        />
      </div>
    </div>
  );
};

export default AuthPage;
