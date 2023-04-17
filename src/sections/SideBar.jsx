import React from "react";

function SideBar() {
  const navClose = function nav_close() {
    document.getElementById("mySidebar").style.display = "none";
  };

  return (
    <nav
      id="mySidebar"
      className="w3-sidebar w3-bar-block w3-card w3-top w3-xlarge w3-animate-left"
      style={{ display: "none", zIndex: "2" }}
    >
      <a href="#menu" onClick={navClose} className="w3-bar-item w3-button">
        Close Menu
      </a>
      <a
        href="#info-planer"
        onClick={navClose}
        className="w3-bar-item w3-button"
      >
        Information
      </a>
      <a
        href="#meal-planer"
        onClick={navClose}
        className="w3-bar-item w3-button"
      >
        Meal Planer
      </a>
    </nav>
  );
}

export default SideBar;
