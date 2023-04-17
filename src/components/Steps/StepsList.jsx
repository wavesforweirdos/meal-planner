import React from "react";
import StepCard from "./StepCard";

function StepList({ steps }) {
  return (
    <div className="directions_list">
      {steps &&
        steps.map((step, index) => <StepCard key={index} step={step} />)}
    </div>
  );
}

export default StepList;
