import React from "react";

export default function FeedbackCard({ title, list, emoji }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{emoji} {title}</h3>
      <ul className="list-disc list-inside text-gray-700">
        {list?.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
