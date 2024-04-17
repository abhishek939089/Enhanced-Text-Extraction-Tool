import React, { useState } from 'react';
import axios from "axios";
// import './App.css';

function GPT() {
  const [query, setQuery] = useState('');
  
  const handleApi = () =>{
    console.log({query});
    const url = "http://localhost:3001/chat";
    const data = {query};
    axios.post(url,data)
    .then((res)=>{
        console.log(res)
        if (res.data.message) {
            alert(res.data.message);
          }
        })
        .catch((err) => {
            console.log(err, 20);
            alert("Server Error");
          });
}
  return (
    <div className="GptApp">
      <h1>Chat with GPT</h1>      
        <input type="text" value={query} onChange={(e)=>{setQuery(e.target.value)}} placeholder="Ask something..." />
        <button onClick={handleApi}>Send</button>
    </div>
  );
}

export default GPT;
