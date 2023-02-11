import { useState, useEffect } from "react";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import Button from "../components/Button";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import { axiosInstance } from "../atoms/config";
import PreviewExcel from "../components/InputData/PreviewExcel";

export default function SubClass() {
  const URL = `${process.env.REACT_APP_BASE_URL}subclass`;
  const defaultInput = {
    name: "",
    quota: 32,
    credit: 3,
    semester: 1,
  };
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [update, setUpdate] = useState("");
  const [mode, setMode] = useState("input");
  const [edit, setEdit] = useState({});
  const [input, setInput] = useState(defaultInput);
  const [excelName, setExcelName] = useState("");
  const [excelFile, setExcelFile] = useState([]);

  const inputField = [
    {
      id: 1,
      name: "Nama",
      placeholder: "Masukkan nama matkul",
      valuefor: "name",
      type: "text",
      width: "3",
    },
    {
      id: 2,
      name: "Semester",
      placeholder: "1",
      valuefor: "semester",
      type: "number",
      width: "1",
    },
    {
      id: 3,
      name: "SKS",
      placeholder: "3",
      valuefor: "credit",
      type: "number",
      width: "1",
    },
    {
      id: 4,
      name: "Kuota",
      placeholder: "32",
      valuefor: "quota",
      type: "number",
      width: "1",
    },
  ];

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

  // handle import Excel
  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      /* Read the file as binary string */
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      /* Get the first worksheet in the workbook */
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      /* Convert the worksheet to JSON format */
      const data = XLSX.utils.sheet_to_json(worksheet);
      /* Do something with the data */
      setExcelFile(data);
    };

    setExcelName(file.name);
    reader.readAsBinaryString(file);
    event.target.value = "";
  }

  // get subclass data
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(URL);
        // "dummy_data/matkul.json"
        setSubClass(res.data.data);
      } catch (err) {
        notifyError(err.message);
      }
    })();
  }, [update, URL]);

  // post new data
  async function handlePost() {
    try {
      await axiosInstance.post(URL, {
        name: input.name,
        course_name: "subkelas",
        quota: input.quota,
        credit: input.credit,
        semester: input.semester,
      });
      notifySucces(`${input.name} ditambahkan`);
      setInput(defaultInput);
      setUpdate(`update${Math.random()}`);
    } catch (err) {
      console.log(err);
      notifyError(err.message);
    }
  }

  // edit one custom data
  function handleEdit(obj) {
    console.log(obj);
    setEdit({
      sub_class_id: obj.sub_class_id,
      name: obj.name,
      quota: obj.quota,
      credit: obj.credit,
      semester: obj.semester,
    });
    setMode("edit");
  }

  function submitEdit() {
    Swal.fire({
      html: `Anda yakin mengubah mata kuliah <b>${edit.name}</b> ?`,
      toast: true,
      icon: "success",
      iconColor: "#16a34a",
      showCancelButton: true,
      cancelButtonText: "Batal",
      cancelButtonColor: "#991b1b",
      confirmButtonText: "Edit",
      confirmButtonColor: "#16a34a",
      showClass: {
        popup: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handlePatch();
      }
    });
  }

  async function handlePatch() {
    try {
      console.log(edit);
      await axiosInstance.put(`${URL}/${edit.sub_class_id}`, {
        name: edit.name,
        quota: edit.quota,
        credit: edit.credit,
        semester: edit.semester,
      });
      notifySucces(`${edit.name} diubah`);
      setMode("input");
      setUpdate(`update${Math.random()}`);
    } catch (err) {
      console.log(err);
      notifyError(err.message);
    }
  }

  // delete one data
  function submitDelete(obj) {
    Swal.fire({
      html: `Anda yakin menghapus mata kuliah <b>${obj.name}</b> ?`,
      toast: true,
      icon: "warning",
      iconColor: "#991b1b",
      showCancelButton: true,
      cancelButtonText: "Batal",
      cancelButtonColor: "#111827",
      confirmButtonText: "Hapus",
      confirmButtonColor: "#991b1b",
      showClass: {
        popup: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(obj);
      }
    });
  }

  async function handleDelete(obj) {
    try {
      await axiosInstance.delete(`${URL}/${obj.sub_class_id}`);
      notifySucces(`${obj.name} dihapus`);
      setUpdate(`update${Math.random()}`);
    } catch (err) {
      notifyError(err.message);
    }
  }

  console.log(excelFile, excelName);

  return (
    <div className="relative">
      <div className="h-10 border-b bg-white"></div>
      <div className="grid grid-cols-4 m-10 gap-5">
        {/* Input & Edit Field */}
        {mode === "input" ? (
          <div className="p-7 border-2 rounded-lg col-span-3 bg-white">
            <p className="text-xl font-bold mb-2">Tambah Matkul</p>
            <div className="grid grid-cols-6 space-x-4">
              {inputField.map((inpt) => (
                <div
                  key={inpt.id}
                  className={`col-span-${inpt.width} space-y-1`}
                >
                  <p className="text-grey">
                    {inpt.name}
                    <span className="text-red-500">*</span>
                  </p>

                  <input
                    id={inpt.valuefor}
                    type={inpt.type}
                    placeholder={inpt.placeholder}
                    value={input[inpt.valuefor]}
                    className="border-2 rounded-lg w-full p-2 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
                    onChange={(e) =>
                      setInput({ ...input, [e.target.id]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex mt-2 justify-end">
              <Button text="Tambah" color="dark" onClick={handlePost} />
            </div>
          </div>
        ) : (
          <div className="p-7 border-2 rounded-lg col-span-3 bg-white">
            <p className="text-xl font-bold mb-2">Edit Matkul</p>
            <div className="grid grid-cols-6 space-x-4">
              {inputField.map((inpt) => (
                <div
                  key={inpt.id}
                  className={`col-span-${inpt.width} space-y-1`}
                >
                  <p className="text-grey">
                    {inpt.name}
                    <span className="text-red-500">*</span>
                  </p>

                  <input
                    id={inpt.valuefor}
                    type={inpt.type}
                    placeholder={inpt.placeholder}
                    value={edit[inpt.valuefor]}
                    className="border-2 rounded-lg w-full p-2 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
                    onChange={(e) =>
                      setEdit({ ...edit, [e.target.id]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-2 space-x-2">
              <Button text="Edit" color="succes" onClick={submitEdit} />
              <Button
                text="Batal"
                color="danger"
                onClick={() => setMode("input")}
              />
            </div>
          </div>
        )}

        {/* Import Excel Field */}
        <div className="p-7 border-2 rounded-lg col-span-1 bg-white">
          <p className="text-xl font-bold mb-2">Import Excel</p>
          <label className="flex justify-center w-full h-32 px-4 transition bg-grey-light border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-grey-dark focus:outline-none">
            <span className="flex items-center space-x-2">
              <ArrowUpTrayIcon className="h-5" />
              <span className="font-medium text-gray-600">
                Drop file di sini, atau
                <span className="text-blue-600"> cari</span>
              </span>
            </span>
            <input
              type="file"
              name="file_upload"
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onInput={handleFileUpload}
            />
          </label>
        </div>

        <PreviewExcel
          filename={excelName}
          file={excelFile}
          deleteFile={() => {
            setExcelFile([]);
            setExcelName("");
          }}
        />

        <div className="py-7 border-2 rounded-lg bg-white col-span-4 h-auto">
          <p className="px-7 text-xl font-bold mb-5">Daftar Mata Kuliah</p>
          <div className=" overflow-x-auto">
            {/* Dropdown & Search */}
            <TableHeader
              onChange={setTerm}
              onClick={setPostPerPage}
              postsPerPage={postsPerPage}
              jsonData={currentSubClass}
            />

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="border-y text-gray-700/50 bg-gray-50">
                <tr>
                  <th scope="col" className="pl-8 pr-6 py-3">
                    Nama Matkul
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Kuota
                  </th>
                  <th scope="col" className="px-6 py-3">
                    SKS
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Semester
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {currentSubClass.map((subcls) => (
                  <tr key={subcls.sub_class_id} className="bg-white border-b">
                    <th
                      scope="row"
                      className="pl-8 pr-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {subcls.name}
                    </th>
                    <td className="px-6 py-4">{subcls.quota}</td>
                    <td className="px-6 py-4">{subcls.credit}</td>
                    <td className="px-6 py-4">{subcls.semester}</td>
                    <td className="flex pt-2 space-x-3">
                      <Button
                        text="🖊"
                        color="succes"
                        onClick={() => handleEdit(subcls)}
                      />
                      <Button
                        text="❌"
                        color="danger"
                        onClick={() => submitDelete(subcls)}
                      />
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
        </div>
      </div>
    </div>
  );
}
