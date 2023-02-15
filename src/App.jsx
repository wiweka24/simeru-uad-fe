import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SubClass from "./pages/SubClass";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  // Get value from Child Components
  const [acadYear, setAcadYear] = useState("");
  const getAcadYear = (value) => {
    console.log(value, "gotacadyear");
    setAcadYear(value);
  };

  console.log(acadYear);
  //App
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
      <Router>
        {/* Sidebar */}
        <Sidebar getAcadYearValue={getAcadYear} />

        {/* Pages */}
        <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<SubClass />} />
            <Route
              path="/DosenMatkul"
              element={<LecturerCourse acyear={acadYear} />}
            />
            <Route path="/RuangWaktu" element={<RoomTime />} />
            <Route path="/MKTerselenggara" element={<CourseHelp />} />
            <Route path="/Jadwal" element={<Schedule />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
