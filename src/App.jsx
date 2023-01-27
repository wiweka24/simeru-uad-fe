import { 
  BrowserRouter as Router,  
  Route, 
  Routes
} from 'react-router-dom'
import Sidebar from './components/Sidebar';
import SubClass from './pages/SubClass';
import LecturerCourse from './pages/LecturerCourse';

export default function App() {
  return (
    <div className="grid grid-cols-7 overflow-hidden h-screen">
    <Router>

      {/* Sidebar */}
      <Sidebar />
      
      {/* Pages */}
      <div className="col-span-6 overflow-y-scroll bg-[#f9fafb]">
      <Routes>
        <Route path='/' element={<SubClass/>} />
        <Route path='/DosenMatkul' element={<LecturerCourse/>} />

      </Routes>
      </div>

    </Router>
    </div>
  );
}
