import Login from '@/Components/Login';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { auth, db } from '@/db/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
const LoginHome = () => {


  return (
    <>
     <Login handleLogin={handleLogin}/>
    </>
  )
}

export default LoginHome