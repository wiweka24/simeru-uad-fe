import { useState } from "react";
import { Navigate, BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  ChevronRightIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [acadYear, setAcadYear] = useState({
    start_year: "",
    end_year: "",
    semester: "",
    academic_year_id: 0,
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
            <div
              className={`${
                sidebarOpen ? "flex" : "hidden"
              } flex-col justify-between col-span-1 border-r transition-all duration-500 ease-in-out`}
            >
              <Sidebar getAcadYearValue={setAcadYear} acyear={acadYear} />
            </div>

            {/* App Route */}
            <div
              className={`${
                sidebarOpen ? "col-span-6" : "col-span-7"
              } overflow-y-scroll bg-grey-light`}
            >
              <div className="h-10 border-b bg-white">
                <div
                  className="p-2 w-10 h-10"
                  onClick={() => setSidebarOpen((current) => !current)}
                >
                  {sidebarOpen ? (
                    <ArrowsPointingOutIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </div>
              </div>
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
                  element={
                    <Schedule
                      acyear={acadYear.academic_year_id}
                      formattedAcyear={`${acadYear.start_year}-${
                        acadYear.end_year
                      }-Semester-${Number(acadYear.semester) + 1}`}
                    />
                  }
                />
                <Route
                  path="/*"
                  element={
                    <Error
                      redirect="/MataKuliah"
                      message="Halaman Tidak Ditemukan"
                    />
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/MataKuliah" replace />}
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
