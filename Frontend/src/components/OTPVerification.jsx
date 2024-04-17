import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate,useLocation } from "react-router-dom";

function OTPVerification() {
    const location = useLocation();
    const [email, setEmail] = useState(location.state.email);
    const [otp, setOTP] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/verify-otp', { email, otp });
            alert(response.data.message);
            navigate('/login');  // Navigate after setting the localStorage
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred, please try again.');
        }
    };

    return (
        <div>
            <h1>OTP Verification</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={location.state.email} onChange={(e) => setEmail(e.target.value)} disabled required /><br /><br />
                <label htmlFor="otp">OTP:</label>
                <input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOTP(e.target.value)} required /><br /><br />
                <button type="submit">Verify OTP</button>
            </form>
            <div>{responseMessage}</div>
        </div>
    );
}

export default OTPVerification;
