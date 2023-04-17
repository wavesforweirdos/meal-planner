import React from "react";

function Hero() {
  return (
    <div
      id="hero"
      className="text-center bg-image"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1478144592103-25e218a04891?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80')",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", height: "100vh" }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white px-5">
            <h1 className="mb-3">Your Own Meal Planer</h1>
            <h4 className="mb-5">
              A magical new way to plan your meals. Organize and design your own
              meal planner to save time, customize your meal plan based on your
              diet and eating habits.
            </h4>
            <a
              className="btn btn-outline-light btn-lg"
              href="#calendar"
              role="button"
            >
              My Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
