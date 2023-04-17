import React from "react";

function TopMenu() {
  const navOpen = function nav_open() {
    document.getElementById("mySidebar").style.display = "block";
  };

  return (
    <div id="menu" className="w3-top" >
      <div
        className="w3-white w3-xlarge"
        style={{ maxWidth: "100vw", padding: "0 20px" }}
      >
        <div
          className="w3-padding-16 w3-left"
          onClick={navOpen}
          style={{ textDecoration: "none", color: "white" }}
        >
          ☰
        </div>
        <div className="w3-padding-16 w3-right">
          <a
            href="https://spoonacular.com/food-api/"
            style={{ textDecoration: "none", color: "white" }}
          >
            Spoonacular
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
