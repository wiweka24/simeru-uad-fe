import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Sidebar from "./components/Sidebar";
import LecturerCourse from "./pages/LecturerCourse";
import RoomTime from "./pages/RoomTime";
import CourseHelp from "./pages/CourseHelp";
import Schedule from "./pages/Schedule";
import { Lecturer, Room, Subclass } from "./pages/InputData";

export default function App() {
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
      <Router>
        {/* Sidebar */}
        <Sidebar />

        {/* Pages */}
        <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
          <ToastContainer />
          <Routes>
            <Route path="/MataKuliah" element={<Subclass />} />
            <Route path="/Dosen" element={<Lecturer />} />
            <Route path="/Ruangan" element={<Room />} />
            <Route path="/DosenMatkul" element={<LecturerCourse />} />
            <Route path="/RuangWaktu" element={<RoomTime />} />
            <Route path="/MKTerselenggara" element={<CourseHelp />} />
            <Route path="/Jadwal" element={<Schedule />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
