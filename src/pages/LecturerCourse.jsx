import TableLecturerCredits from "../components/LecturerCourse/TableLecturerCredits";
import TableHeader from "../components/InputData/TableHeader";
import { useState, useEffect } from "react";
import TablePagination from "../components/InputData/TablePagination";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { axiosInstance } from "../atoms/config";
import { notifyError, notifySucces } from "../atoms/notification";

export default function LecturerCourse(acyear) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [offeredSubClass, setOfferedSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [subClass, setSubClass] = useState([])
  const [lecturerPlot, setLecturerPlot] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [updateChild, setUpdateChild] = useState();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}offered_classes/1`);
        setOfferedSubClass(res.data.data);

        const res1 = await axiosInstance.get(`${URL}lecturer_plot/1`);
        setLecturerPlot(res1.data.data);

        const res2 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/lecturer"
        );
        setDosen(res2.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [updateChild, URL]);

  useEffect(() => {
    const mergeData = offeredSubClass.map((item) => {
      const lecturer = lecturerPlot.find((item2) => item2.sub_class_id === item.sub_class_id);
      return {
        ...item,
        lecturer_name: lecturer ? lecturer.lecturer_name : "Mohon Isi Dosen",
      };
    });
    setSubClass(mergeData);
  }, [offeredSubClass, lecturerPlot]);

  function Cell({ value }) {
    const [mode, setMode] = useState("read");
    const [text, setText] = useState(value);
    
    if (mode === "edit") {
      const handleInputChange = (e, obj) => {
        setText({
          ...text,
          lecturer_name: obj.name,
          lecturer_id: obj.lecturer_id,
        });
      };

      const handleSaveClick = async () => {
        setMode("read");
        try {
          await axiosInstance.put(
            "https://dev.bekisar.net/api/v1/lecturer_plot",
            {
              data: [
                {
                  lecturer_id: text.lecturer_id,
                  sub_class_id: text.sub_class_id,
                  academic_year_id: Number(acyear.acyear),
                },
              ],
            }
          );

          setUpdateChild(`update${Math.random()}`);
          notifySucces("Dosen Pengampu Berhasil Ditambahkan");
        } catch (err) {
          notifyError(err.message);
          setUpdateChild(`update${Math.random()}`);
        }
        console.log(text);
      };

      return (
        <div className=" input-group relative flex flex-nowrap ">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={dosen}
            //   .map((option) => ({
            //   id: option.lecturer_id,
            //   label: option.name || text.lecturer_name,
            // }))}
            getOptionLabel={(option) => option.name || text.lecturer_name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" size="small" />
            )}
            type="text"
            className=" text-sm -ml-2 border-2 rounded-lg w-60 bg-grey-light
              
             "
            //value={text.lecturer_name}
            onChange={(e, label) => handleInputChange(e, label)}
          />
          <button
            onClick={handleSaveClick}
            className=" inline-block right  items-center bg-sky-500 hover:bg-sky-600 text-white rounded font-medium px-4 -py-2  ml-3 "
          >
            Ok
          </button>
        </div>
      );
    }
    if (mode === "read") {
      const handleEditClick = () => {
        setMode("edit");
      };
      if (text.lecturer_name === "Mohon Isi Dosen") {
        return (
          <div className="font-bold text-red-500 " onClick={handleEditClick}>
            "Mohon Isi Dosen"
          </div>
        );
      }
      return <div onClick={handleEditClick}>{text.lecturer_name}</div>;
    }
  };

  return (
    <div className="grid grid-cols-6 m-10 gap-5">
      <div className=" border-2 rounded-lg bg-white col-span-4 py-5">
        <div className="relative overflow-x-autorelative overflow-x-auto">
          <p className=" text-xl font-bold mx-4 mt-1 mb-4">Dosen dan Matkul</p>
          <TableHeader
            onChange={setTerm}
            onClick={setPostPerPage}
            postsPerPage={postsPerPage}
          />

          {/* Table */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="border-y text-gray-700/50 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="pl-8 pr-6 py-3">
                  Nama Matkul
                </th>
                <th scope="col" className="px-6 py-3">
                  Semester
                </th>
                <th scope="col" className="px-6 py-3">
                  Kelas
                </th>
                <th scope="col" className="px-6 py-3">
                  Dosen
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubClass.map((subcls) => (
                <tr key={subcls.sub_class_id} className="bg-white border-b">
                  <th
                    scope="row"
                    className="pl-8 pr-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {subcls.sub_class_id}
                  </th>
                  <td className="px-6 py-4 cursor-default">{subcls.name}</td>
                  <td className="px-6 py-4 cursor-default">
                    {subcls.semester}
                  </td>
                  <td className="px-6 py-4 cursor-default">{subcls.credit}</td>
                  <td className="cursor-pointer">
                    <Cell value={subcls} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <TablePagination
            subClass={subClass}
            setCurrentSubClass={setCurrentSubClass}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            term={term}
            columnName="name"
          />
        </div>

        {/* <TableLecturerPlot /> */}
      </div>
      <div className=" border-2 rounded-lg bg-white col-span-2">
        <TableLecturerCredits update={updateChild} />
      </div>
    </div>
  );
}
