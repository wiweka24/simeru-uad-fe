import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import Error from "./pages/Error";
import { axiosInstance } from "./atoms/config";
import { Lecturer, Room, Subclass } from "./pages/InputData";

export default function App() {
  const [acadYear, setAcadYear] = useState({
    start_year: "",
    end_year: "",
    semester: "",
    academic_year_id: "",
  });

  axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = localStorage.getItem("auth_token")
      ? `Bearer ${localStorage.getItem("auth_token")}`
      : "";
    return config;
  });

  //App
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
      <Router>
        {!localStorage.getItem("auth_token") ? (
          // Login and Logout Route
          <div className="col-span-7 overflow-y-hidden h-screen bg-grey-light">
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <Error redirect="/Login" message="Login terlebih dahulu" />
                }
              />
            </Routes>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <Sidebar getAcadYearValue={setAcadYear} acyear={acadYear} />

            {/* App Route */}
            <div className="col-span-6 overflow-y-scroll bg-grey-light">
              <Routes>
                <Route path="/MataKuliah" element={<Subclass />} />
                <Route path="/Dosen" element={<Lecturer />} />
                <Route path="/Ruangan" element={<Room />} />
                <Route
                  path="/DosenMatkul"
                  element={
                    <LecturerCourse acyear={acadYear.academic_year_id} />
                  }
                />
                <Route
                  path="/RuangWaktu"
                  element={<RoomTime acyear={acadYear.academic_year_id} />}
                />
                <Route
                  path="/MKTerselenggara"
                  element={<CourseHelp acyear={acadYear.academic_year_id} />}
                />
                <Route
                  path="/Jadwal"
                  element={<Schedule acyear={acadYear.academic_year_id} />}
                />
                <Route
                  path="/*"
                  element={
                    <Error
                      redirect="/MataKuliah"
                      message="Kembali ke Homepage"
                    />
                  }
                />
              </Routes>
            </div>
          </>
        )}
        <ToastContainer />
      </Router>
    </div>
  );
}
