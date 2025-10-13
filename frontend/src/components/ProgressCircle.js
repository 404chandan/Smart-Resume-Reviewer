import React from "react";

export default function ProgressCircle({ value }) {
  return (
    <div className="flex justify-center my-4">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path className="text-gray-300" strokeWidth="3.8" fill="none" d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0-31.831" />
          <path className="text-blue-600" strokeWidth="3.8" strokeDasharray={`${value}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0-31.831" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">{value}%</span>
      </div>
    </div>
  );
}
