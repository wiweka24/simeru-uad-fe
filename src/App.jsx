import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import { axiosInstance } from "./atoms/config";
import { Lecturer, Room, Subclass } from "./pages/InputData";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [acadYear, setAcadYear] = useState({ year: "2022/2023", value: 1 });
  // const { token, setToken } = useToken();
  // const getToken = localStorage.getItem("auth_token");
  // console.log(getToken, "ini token dah dipassing");

  axiosInstance.interceptors.request.use(function (config) {
    // const tokenString = localStorage.getItem("auth_token");
    // console.log(tokenString);

    config.headers.Authorization = localStorage.getItem("auth_token")
      ? `Bearer ${localStorage.getItem("auth_token")}`
      : "";
    console.log(config.headers.Authorization);
    console.log(localStorage.getItem("auth_token"));
    return config;
  });

  //App
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
      <Router>
        {!localStorage.getItem("auth_token") ? (
          // Login and Logout Route
          <div className="col-span-7 overflow-y-hidden h-screen bg-[#f9fafb]">
            <ToastContainer />
            <Routes>
              <Route path="/Login" element={<Login />} />
            </Routes>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <Sidebar getAcadYearValue={setAcadYear} acyear={acadYear} />

            {/* App Route */}
            <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
              <ToastContainer />
              <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/MataKuliah" element={<Subclass />} />
                <Route path="/Dosen" element={<Lecturer />} />
                <Route path="/Ruangan" element={<Room />} />
                <Route
                  path="/DosenMatkul"
                  element={<LecturerCourse acyear={acadYear.value} />}
                />
                <Route path="/RuangWaktu" element={<RoomTime />} />
                <Route
                  path="/MKTerselenggara"
                  element={<CourseHelp acyear={acadYear.value} />}
                />
                <Route
                  path="/Jadwal"
                  element={<Schedule acyear={acadYear.value} />}
                />
              </Routes>
            </div>
          </>
        )}
      </Router>
    </div>
  );
}
