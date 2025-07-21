import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
const Sample = () => {
   const [name,setName]=useState("");
    const [email,setEmail]=useState("");
   useEffect(() => {
       const getData = async () => {
           const response = await axios.get("http://localhost:8000/api/v1/auth/me",{ withCredentials: true });
           setName(response.data.user);
           setEmail(response.data.user);
       }
       getData();
   })
  return (
     <div>
            <h1>Welcome to the Sample Page!</h1>
            <p>This is the content shown when you click the Sample menu item in the sidebar.</p>
            <p>Current Login User : {name}</p>
            <p>Current Login Email : {email}</p>
        </div>
  )
}

export default Sample;