import { TableContext } from "flowbite-react/lib/esm/components/Table/TableContext";
import TableLecturerCredits from "../components/LecturerCourse/TableLecturerCredits";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../atoms/config";
import { Dropdown } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function LecturerCourse() {
  const URL = `${process.env.REACT_APP_BASE_URL}lecturer_plot/1`;
  const [subClass, setSubClass] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [updateChild, setUpdateChild] = useState();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(URL);
        setSubClass(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [updateChild, URL]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/lecturer"
        );
        setDosen(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  function notifyError(message) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function notifySucces(message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const Cell = ({ value }) => {
    const [mode, setMode] = useState("read");
    const [text, setText] = useState(value);

    // useEffect(() => {
    // 	setText(value);
    // }, [value]); // <--- when value is changed text state is changed too

    if (text.lecturer_name === "") {
      setText({ ...text, lecturer_name: "Mohon Isi Dosen" });
    }

    if (mode === "edit") {
      const handleInputChange = (e, obj) => {
        setText({
          ...text,
          lecturer_name: obj.label,
          lecturer_id: obj.id,
        });
        console.log(obj);
        //console.log(obj);
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
                  academic_year_id: 1,
                },
              ],
            }
          );

          setUpdateChild(`update${Math.random()}`);
          notifySucces("Dosen Pengampu Berhasil Ditambahkan");
        } catch (err) {
          console.log(err);
          notifyError(err.message);
        }
        console.log(text);
      };

      return (
        <div className=" input-group relative flex flex-nowrap ">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={dosen.map((option) => ({
              id: option.lecturer_id,
              label: option.name,
            }))}
            //getOptionLabel={(option) => option.name || text.lecturer_name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" size="small" />
            )}
            type="text"
            className=" text-sm -ml-2 border-2 rounded-lg w-60 bg-grey-light
              
             "
            //value={text.lecturer_name}
            onChange={(e, value) => handleInputChange(e, value)}
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
    return null;
  };

  return (
    <div className="grid grid-cols-6 m-10 gap-5">
      <div className=" border-2 rounded-lg bg-white col-span-4 py-5">
        <div className="relative overflow-x-autorelative overflow-x-auto">
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
                  <td className="px-6 py-4 cursor-default">
                    {subcls.sub_classes_name}
                  </td>
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
            columnName="sub_classes_name"
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
