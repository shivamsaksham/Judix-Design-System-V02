'use client'

import React from "react";
import { showToast, ToastContainer } from "../ui";

export default function ToastDemo() {
  // Simulate a network request for promise toast
  const simulateNetworkRequest = () => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        // I'll use the rejected string directly in the error message
        if (Math.random() > 0.4) resolve("Data loaded successfully!");
        else reject("Network error occurred.");
      }, 2000);
    });
  };

  const handlePromiseClick = () => {
    showToast.promise(simulateNetworkRequest(), {
      loading: "Loading data...",
      success: "Data loaded successfully!",
      error: "Error: Network error occurred.", 
    });
  };

  // Button style reused
  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    border: "none",
    borderRadius: "var(--primitives-border-radius-sm)",
    fontSize: "var(--primitives-font-size-100)",
    fontWeight: 500,
    cursor: "pointer",
    color: "var(--primitives-color-neutral-light-100)",
  };

  return (
    <div className="font-family-primarybranding"style={{ padding: "40px", fontFamily: "var(--primitives-font-family-satoshi)" }}>
      {/* Toast container */}
      <ToastContainer position="top-right" />

      <h1 style={{ fontSize: "var(--primitives-font-size-600)", fontWeight: 700, marginBottom: "24px" }}>
        Toast Demo
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px" }}>
        <button
          style={{ ...buttonStyle, backgroundColor: "var(--primitives-color-semantic-green-400)" }}
          onClick={() => showToast.success("Search query enhanced")}
        >
          Show Success Toast
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: "var(--primitives-color-semantic-red-400)" }}
          onClick={() => showToast.alert("Something went wrong")}
        >
          Show Alert Toast
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: "var(--primitives-color-semantic-orange-400)" }}
          onClick={() => showToast.notice("Upgrade to access this feature")}
        >
          Show Notice Toast
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: "var(--primitives-color-semantic-blue-400)" }}
          onClick={() => showToast.info("Shared with Adv. Saket Sharma")}
        >
          Show Info Toast
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: "var(--primitives-color-neutral-contrast-800)" }}
          onClick={handlePromiseClick}
        >
          Show Loading/Promise Toast
        </button>
      </div>
    </div>
  );
}
