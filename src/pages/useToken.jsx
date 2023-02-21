import { useEffect } from "react";
import { useState } from "react";

export default function useToken() {
  const [token, setToken] = useState("");
  
  const getToken = () => {
    const tokenString = localStorage.getItem("auth_token");
    var userToken = JSON.stringify(tokenString);
    var userToken = JSON.parse(userToken);
    console.log(userToken, "tokenstring");
    return tokenString;
  };
  
  const saveToken = (userToken) => {
    console.log(userToken, "ini user token");
    localStorage.setItem("auth_token");
    setToken(userToken.auth_token);
  };

  useEffect(() => {
    getToken()
  }, [token])

  // console.log(token, "settoken");
  return {
    setToken: saveToken,
    token,
  };
}
