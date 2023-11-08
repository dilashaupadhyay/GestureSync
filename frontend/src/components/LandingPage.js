import React from "react";
import Navbar from "./Navbar";
import "./LandingPage.css"; // Import the CSS file

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Welcome to our Landing Page</h1>
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default LandingPage;
