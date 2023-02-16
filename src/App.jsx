import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import { Lecturer, Room, Subclass } from "./pages/InputData";
import Spinner from "./atoms/Spinner";

export default function App() {
  const [acadYear, setAcadYear] = useState({ year: "2022/2023", value: 1 });

  //App
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
      <Router>
        {/* Sidebar */}
        <Sidebar getAcadYearValue={setAcadYear} acyear={acadYear} />

        {/* Pages */}
        <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
          <ToastContainer />

          <Routes>
            <Route path="/Login" element={<Login />}></Route>
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
      </Router>
    </div>
  );
}
