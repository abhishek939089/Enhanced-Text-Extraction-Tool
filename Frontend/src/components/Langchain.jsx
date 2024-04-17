import React, { useState, useEffect } from "react";
import axios from "axios";

function Langchain() {
  const [enrichedData, setEnrichedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080");
      setEnrichedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Enriched Data from PDF</h1>
      <div>
        {enrichedData.map((pageData, index) => (
          <div key={index}>
            <h2>Page {index} Enriched Data:</h2>
            <p>{pageData}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Langchain;
