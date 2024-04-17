import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import OTPVerification from "./OTPVerification";

function Signup(){
    const [email,setemail] = useState('');
    const [password,setpassword] = useState('');
    const [username,setusername] = useState('');
    const navigate = useNavigate();
    const handleApi = () =>{
        console.log({username,email,password});
        const url = "http://127.0.0.1:3001/signup";
        const data = {username,email,password};
        axios.post(url,data)
        .then((res)=>{
            console.log(res)
            alert('Account is Created. Please Verify  Your Email');
            navigate('/OTPVerification',{state:{email}});
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return(
        <div>
            <h2>Sign Up</h2>
            Username<br/>
            <input type="text" name ="username" id="username" value={username} onChange={(e)=>{setusername(e.target.value)}} /><br/>
            Email<br/>
            <input type="email" name="email" id="email" value={email} onChange={(e)=>{setemail(e.target.value)}}/><br />
            Password<br/>
            <input type="password" name="password" id="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/><br />
            <button onClick={handleApi}>Submit</button>
            <Link to="../login">Login</Link>
        </div>
        
    )
}
export default Signup;