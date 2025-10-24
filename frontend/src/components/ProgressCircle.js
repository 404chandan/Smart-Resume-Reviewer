import React from "react";

export default function ProgressCircle({ value }) {
  // Cap the value between 0–100
  const safeValue = Math.min(Math.max(value, 0), 100);

  // SVG circle parameters
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="flex justify-center my-6">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          {/* Background Circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#e5e7eb" // Tailwind gray-300
            strokeWidth="3.8"
          />

          {/* Progress Circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#2563eb" // Tailwind blue-600
            strokeWidth="3.8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 18 18)" // Start from top
            style={{
              transition: "stroke-dashoffset 0.7s ease-in-out",
            }}
          />
        </svg>

        {/* Percentage Label */}
        <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-800">
          {safeValue}%
        </span>
      </div>
    </div>
  );
}
