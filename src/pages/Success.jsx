import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart now that payment is confirmed
    clearCart();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#050608",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20, fontFamily: "system-ui, sans-serif",
      color: "#f5f5f5", textAlign: "center", padding: "0 2rem 2rem 2rem",
    }}>
      <div style={{ fontSize: 64 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0FD980", margin: 0 }}>
        Order Confirmed!
      </h1>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.7 }}>
        Your build has been received. We'll be in touch shortly to confirm parts and build timeline.
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
        Session: {sessionId}
      </p>
      <p style={{ fontSize: 18, color: "#fff", fontFamily: "monospace" }}>
        You can check your order history in your <Link to={`/profile/${user?.id}`} className="price-span">profile</Link>. 
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 8, padding: "12px 28px", fontSize: 12,
          fontWeight: 700, letterSpacing: 2, borderRadius: 8,
          background: "#0FD980", color: "#050608", border: "none",
          cursor: "pointer",
        }}
      >
        BACK TO HOME →
      </button>
    </div>
  );
}