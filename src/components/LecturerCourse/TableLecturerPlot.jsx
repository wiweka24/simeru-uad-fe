import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
// import { store, useGlobalState } from "state-pool";
import TableHeader from "../InputData/TableHeader";
import TablePagination from "../InputData/TablePagination";
import { Dropdown } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { createGlobalstate, useGlobalState } from "state-pool";

export default function TableLecturerPlot() {
  const URL = `${process.env.REACT_APP_BASE_URL}lecturer_plot/1`;
  const [subClass, setSubClass] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [currentSubClass, setCurrentSubClass] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(URL);
        setSubClass(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

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

  // const handlePut = async () => {
  //   try {
  //     const res = await axiosInstance.post(URL, {
  //       name: input.name,
  //       course_name: "subkelas",
  //       quota: input.quota,
  //       credit: input.credit,
  //       semester: input.semester,
  //     });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  // const dosens = dosen.map(({name})=>name)
  // Enter Input Dosen Value'
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
        } catch (err) {
          console.log(err);
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
            renderInput={(params) => <TextField {...params} />}
            type="text"
            className=" text-sm -ml-2 border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
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
    <div className="relative overflow-x-auto">
      {/* Search */}
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
              <td className="px-6 py-4">{subcls.sub_classes_name}</td>
              <td className="px-6 py-4">{subcls.semester}</td>
              <td className="px-6 py-4">{subcls.credit}</td>
              <td>
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
  );
}
