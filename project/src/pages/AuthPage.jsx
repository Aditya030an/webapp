import { useState } from "react";
import AuthModal from "../Component/AuthModal";

const AuthPage = () => {
  const [type, setType] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthModal
        type={type}
        onClose={() => {}}
        onAuthSuccess={() => {
          window.location.href = "/";
        }}
        onSwitchType={(t) => setType(t)}
      />
    </div>
  );
};

export default AuthPage;
