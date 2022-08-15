import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function AboutPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Navbar />
        <hr />
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
