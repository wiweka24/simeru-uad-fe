import React from "react";

export default function Login() {
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
        <form className=" space-y-4" action="#">
          <div className="-space-y-px px-4">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
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
