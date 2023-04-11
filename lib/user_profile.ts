// lib/auth.js
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken'; // If you're using JWT tokens
import { NextApiRequest } from 'next';


export const getUserProfile = async () => {
  //const cookies = req.headers.cookie ? Cookies.parse(req.headers.cookie) : {};

   const token = Cookies.get('userToken');

  if (token == undefined) {
    return false;
  } else {
    // Get profile of the user from the token
    const res = await fetch('http://127.0.0.1:8000/api/profile', {
      method: 'POST',
      headers: {
        Bearer: token,
      },
    });
    //const data = await res.json();
    //alert(res.status)
    if (res.status == 200) {
      const data = await res.json();
      return data.name 
      //return true;
    }
  }
  return "Unknown";
};
