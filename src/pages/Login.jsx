import React, { useState } from "react";
import { axiosInstance } from "../atoms/config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { notifyError } from "../atoms/notification";
import { func } from "prop-types";

export default function Login({setToken}) {
  const URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
    error_list: [],
  });

  const getToken = () => {
    // constTokenString = localStorage.getItem('token');
  };

  const handleInput = (e) => {
    e.persist();
    setLoginInput({ ...loginInput, [e.target.id]: e.target.value });
  };

  async function loginSubmit(e) {
    e.preventDefault();
    try {
      axiosInstance
        .post(`${URL}login`, {
          email: loginInput.email,
          password: loginInput.password,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("auth_token", res.data.access_token);
            new Swal("Login Succes", res.message);
            console.log(res.data.message);
            navigate("/MataKuliah");
            // window.location.href = "http://localhost:3000/MataKuliah";
          }
        });
    } catch (err) {
      console.log(err);
      notifyError(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-grey-light">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md space-y-8  ">
        <img
          src="https://sbmptmu.id/wp-content/uploads/2022/03/Logo-UAD-Berwarna-1024x1024.png"
          alt=""
          className=" rounded-full w-4/12 mx-auto pt-7"
        />
        <h2 className="text-center text-3xl font-bold text-gray-800 ">
          Login to Admin Account
        </h2>
        <form className=" space-y-4" action="#" onSubmit={loginSubmit}>
          <div className="-space-y-px px-4">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={loginInput.email}
              onChange={(e) => handleInput(e)}
              placeholder="Email address"
              className="w-full px-3  py-2 mt-2  rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            />
          </div>
          <div className="-space-y-px px-4">
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={loginInput.password}
              onChange={(e) => handleInput(e)}
              placeholder="Your Password"
              className="w-full py-2 mt-2 px-3  border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            />
          </div>
          <div className="align-center px-4 pb-5 pt-3">
            <button
              type="submit"
              className="w-full bg-sky-600 py-2 rounded-md text-gray-200 font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
