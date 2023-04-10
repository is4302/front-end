// lib/auth.js
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken'; // If you're using JWT tokens
import { NextApiRequest } from 'next';

export const isAuthenticated = async (req: NextApiRequest) => {
  //const cookies = req.headers.cookie ? Cookies.parse(req.headers.cookie) : {};

   const token = Cookies.get('userToken');

  if (token == undefined) {
    return false;
  } else {
    // Get profile of the user from the token
    const res = await fetch('http://127.0.0.1:8000/api/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (data.status === 'success') {
      return true;
    }
  }
  return false;
};
