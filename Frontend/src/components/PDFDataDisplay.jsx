import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraftEditor from './DraftEditor'; // Import your word file editor component
import './PDFDataEditor.css'; // Import your CSS file

function PDFDataEditor() {
    const [enrichedData, setEnrichedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWords, setSelectedWords] = useState([]);

    useEffect(() => {
      // Fetch data from the backend API
      axios.get('http://localhost:3001/enrichedData')
        .then(response => {
          // Set the retrieved data to the state
          setEnrichedData(response.data.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);

    // Function to handle selection of important words
    const handleSelectWord = (word) => {
      setSelectedWords(prevWords => [...prevWords, word]);
    };

    // Function to download edited PDF
    const downloadPDF = () => {
      // Combine original PDF with selected important words
      // Implement download logic here
    };

    return (
      <div className="pdf-editor-container">
        <div className="editor-container">
          <h2>Word File Editor</h2>
          <DraftEditor />
        </div>
        <div className="data-container">
          <h2>Enriched Data</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {enrichedData.map((item, index) => (
                <div key={index} className="data-item">
                  <h3>Page {item.pageNumber}</h3>
                  <p><strong>Original Text:</strong> {item.originalText}</p>
                  <p><strong>Enriched Text:</strong> {item.enrichedText}</p>
                  <button onClick={() => handleSelectWord(item.enrichedText)}>Select</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    );
}

export default PDFDataEditor;
