import { logout } from "../hooks/auth/useLogout";

export const TestSessionExpired = () => {
  const testSessionExpired = async () => {
    alert("Testing: Session expired");
    await logout();
    window.location.href = "/login";
  };

  if (!import.meta.env.DEV) return null;

  return (
    <button
      onClick={testSessionExpired}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        padding: "10px 20px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Test Session Expired
    </button>
  );
};
