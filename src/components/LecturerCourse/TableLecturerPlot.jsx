import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
import { Dropdown } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function TableLecturerPlot() {
  const [subClass, setSubClass] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);

  const indexOfLastSubClass = currentPage * postsPerPage;
  const indexOfFirstSubClass = indexOfLastSubClass - postsPerPage;
  const currentSubClass = subClass.slice(
    indexOfFirstSubClass,
    indexOfLastSubClass
  );
  const totalPages = Math.ceil(subClass.length / postsPerPage);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/lecturerplot.json");
        setSubClass(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/dosen.json");
        setDosen(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

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
      const handleInputChange = (e) => {
        setText({ ...text, [e.target.id]: e.target.value });
      };

      const handleSaveClick = () => {
        setMode("read");
        console.log(text);
      };

      return (
        <div className=" input-group relative flex flex-nowrap ">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={dosen}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
            type="text"
            className=" text-sm -ml-2 border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
            value={text.lecturer_name}
            onChange={handleInputChange}
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
  //   const[dosen, setDosen] = useState('')
  // const[dosenUpdated, setDosenUpdated] = ('')

  // const handleChangeDosen = (event) => {
  //   console.log('dosen: ', event.target.value)
  //   setDosen(event.target.value);
  // };

  // const handleKeyDownDosen = (event) => {
  //   if (event.key === 'Enter') {
  //     // 👇 Get input value
  //     setDosenUpdated(dosen);
  //   }
  // };

  const pageNumber = ["10", "25", "50", "100"];

  function changePage(value) {
    if (value === "increment" && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1);
    } else if (value === "decrement" && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1);
    }
  }

  return (
    <div className="relative overflow-x-auto">
      {/* Search */}
      <p className=" text-xl font-bold mx-8 my-4">Matkul Aktif</p>
      <nav className="mx-8 flex mb-3 items-center justify-between">
        <Dropdown
          label={postsPerPage}
          color="dark"
          outline="true"
          className="bg-grey-light"
        >
          {pageNumber.map((number) => (
            <Dropdown.Item onClick={() => setPostPerPage(number)}>
              {number}
            </Dropdown.Item>
          ))}
        </Dropdown>

        <div className="relative mx-20">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
            placeholder="Search for items"
          />
        </div>
      </nav>

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
      <nav
        className="mx-8 flex m-3 items-center justify-between"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500">
          Data
          <span className="font-semibold text-gray-900">
            {" "}
            {indexOfFirstSubClass + 1} - {indexOfLastSubClass}{" "}
          </span>
          dari
          <span className="font-semibold text-gray-900">
            {" "}
            {subClass.length}{" "}
          </span>
        </span>

        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => changePage("decrement")}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5" />
            </a>
          </li>

          {/* Page Number - Stil Confused */}
          {/* <li>
            <a className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
          </li> */}

          <li>
            <a
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => changePage("increment")}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
