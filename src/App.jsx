import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import { Lecturer, Room, Subclass } from "./pages/InputData";
import useToken from "./pages/useToken";

export default function App() {
  const [acadYear, setAcadYear] = useState({ year: "2022/2023", value: 1 });
  const { token, setToken } = useToken();
  console.log(token, "ini token dah dipassing");

  // axiosInstance.interceptors.request.use(function (config) {
  //   const tokenString = localStorage.getItem("auth_token");
  //   console.log(tokenString);
  //   config.headers.Authorization = tokenString ? `Bearer ${tokenString}` : "";
  //   return config;
  // });

  // useEffect(() => {

  // },[]);

  //App
  return (
    <Router>
      {!token ? (
        <div className="overflow-y-hidden h-screen bg-[#f9fafb]">
          <Routes>
            <Route path="/Login" element={<Login setToken={setToken} />} />
          </Routes>
        </div>
      ) : (
        <div className="grid grid-cols-7 overflow-hidden h-screen">
          <Sidebar getAcadYearValue={setAcadYear} acyear={acadYear} />
          <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
            <ToastContainer />
            <Routes>
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
        </div>
      )}
    </Router>
  );

  // return (
  //   <Router>
  //     {render}
  //   </Router>
  // )
}
