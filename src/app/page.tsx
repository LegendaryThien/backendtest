"use client";
import { useState } from "react";

// Define the type for our API response
interface ApiResponse {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent refresh

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputValue)
    });
    // Add type assertion to the response.json()
    const data = await response.json() as ApiResponse;
    setMessage(data.message);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">
          Submit
        </button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}
