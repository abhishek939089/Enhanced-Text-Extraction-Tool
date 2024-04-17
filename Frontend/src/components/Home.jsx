import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import CSS file for styling


function Home() {
  const handleLogout = () => {
    // Clear username and token from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    // Redirect to the login page or any other desired page
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">Text Enrichment Tool</h1>
        <ul className="nav-links">
          <li><Link to="/PDFDataDisplay">Upload File</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/" onClick={handleLogout} >Logout</Link></li>
          <li>{
  !localStorage.getItem("token") ? (
    <Link to="/login" className="login-link" style={{ marginRight: "15px", marginLeft: "15px", width: '200px' }}>
      Login
    </Link>
  ) : (
    <Link
      to="/"
      className="logged-in-link"
      style={{ marginRight: "15px", marginLeft: "15px", width: '100px' }}
    >
      <span className="plus-icon" style={{ marginBottom: '200px' }}></span>&nbsp;&nbsp;Logged In
    </Link>
  )
}</li>

          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <div className="content">
        <h1>Welcome to Enhanced Text Extraction and Enrichment Tool</h1>
        <p>
          This tool utilizes Langchain library for text extraction and OpenAI for data enrichment.
        </p>
        <p>
          It allows users to upload files, extract text from PDF formats, enrich the extracted data using OpenAI, and display the processed results in an interactive table format.
        </p>
        <p>
          Get started by <Link to="/PDFDataDisplay">uploading a file</Link>.
        </p>
      </div>
    </div>
  );
}

export default Home;
