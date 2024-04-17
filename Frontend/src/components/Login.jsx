import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login(){
  
    const [username,setusername] = useState('');
    const [email,setemail] = useState('');
    const [password,setpassword] = useState('');
    const navigate = useNavigate();

    const handleApi = () =>{
        console.log({email,password});
        const url = "http://127.0.0.1:3001/login";
        const data = {username,email,password};
        axios.post(url,data)
        .then((res)=>{
            console.log(res)
            if (res.data.message) {
                if (res.data.token) {
                  localStorage.setItem('token', res.data.token);
                  localStorage.setItem('username', res.data.username);
                  
                  navigate('/');  // Navigate after setting the localStorage
                }
                alert(res.data.message);
              }
            })

            .catch((err) => {
                console.log(err, 20);
                alert("Server Error");
              });
    }

    return(
        <div>
            <h2>Login</h2>
            UserName<br/>
            <input type="username" name="username" id="username" value={username} onChange={(e)=>{setusername(e.target.value)}}/><br />
            
            Email<br/>
            <input type="email" name="email" id="email" value={email} onChange={(e)=>{setemail(e.target.value)}}/><br />
            Password<br/>
            <input type="password" name="password" id="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/><br />
            <button onClick={handleApi}>Submit</button>
            <Link to="../signup">Signup</Link>
        </div>
    )
}
export default Login;