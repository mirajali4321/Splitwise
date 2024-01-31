import { auth } from '../firebase';
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoutes(props) {
    const { Children}=props
    const [user,setuser]=useState(true)

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setuser(true);
          } else {
            auth.signOut();
            setuser(false);
          }
        });
        return () => unsubscribe();
    },[])
    
    return user ? <Children/> : <Navigate to="/login" />;
}