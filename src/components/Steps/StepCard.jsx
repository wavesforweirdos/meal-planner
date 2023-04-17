import React from "react";

function StepsCard({ step }) {
  return (
    <div className="step">
      <div className="step-number">Step {step.number}</div>
      <div className="step-desc">{step.step}</div>
    </div>
  );
}

export default StepsCard;
