import React, { useState } from "react";
import axios from "axios"; //npm install axios
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; //package npm install jwt-decode //npm install jsonwebtoken

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  const register = async (data) => {
    await axios.post("http://localhost:4000/auth/register", data);
    navigate("/login");
  };

  //ใส่ logic login
  const login = async (data) => {
    try {
      const result = await axios.post("http://localhost:4000/auth/", data);
      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setState({ ...state, user: userDataFromToken });
      navigate("/");
      // ใส่ condition login ตรวจสอบ role
      if (userDataFromToken.role === "admin") {
        navigate("/admin-category");
      } else if (userDataFromToken.role === "customer") {
        navigate("/");
      }
    } catch (e) {
      if (e.response && e.response.data) {
        setErrorLogin("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    }
  };

  //ใส่ removeItem ตอน logout
  const logout = () => {
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token");
    setState({ ...state, user: null, error: null });
  };
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        errorLogin,
        setErrorLogin,
        isAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
