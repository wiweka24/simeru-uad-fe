import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import Button from "../Button";
import Spinner from "../../atoms/Spinner";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import PreviewExcel from "./PreviewExcel";
import { axiosInstance } from "../../atoms/config";
import { notifyError, notifySucces } from "../../atoms/notification";
import Error from "../../pages/Error";

export default function InputData({
  defaultInput,
  inputField,
  path,
  attribute,
  title,
}) {
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
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [error, setError] = useState([]);

  // Menampilkan data tergantung dari halaman yang dipilih
  function dataJson(data) {
    if (path === "subclass") {
      return {
        sub_class_id: data.sub_class_id || "",
        name: data.name,
        quota: data.quota,
        credit: data.credit,
        semester: data.semester,
      };
    } else if (path === "lecturer") {
      return {
        lecturer_id: data.lecturer_id || "",
        name: data.name,
        email: data.email,
        phone_number: data.phone_number || "0000000",
      };
    } else {
      return {
        room_id: data.room_id || "",
        name: data.name,
        quota: data.quota,
      };
    }
  }

  function sortJSON(data) {
    if (path === "subclass") {
      data.sort((a, b) => {
        if (a.name !== b.name) {
          return a.name.localeCompare(b.name);
        } 
      });
    }
    
    return data;
  }

  const rerender = () => {
    setUpdate(`update ${Math.random()}`);
  };

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
        setLoading(true);
        const res = await axiosInstance.get(path);
        setSubClass(sortJSON(res.data.data));
      } catch (err) {
        setFetchFailed(true);
        setError(err.response);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    })();
  }, [update]);

  // post new data
  async function handlePost() {
    try {
      setLoading(true);
      await axiosInstance.post(path, {
        data: [dataJson(input)],
      });
      console.log(dataJson(input));
      notifySucces(`${input.name} ditambahkan`);
      setInput(defaultInput);
      rerender();
    } catch (err) {
      notifyError(err);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  // edit one custom data
  function handleEdit(obj) {
    setEdit(dataJson(obj));
    setMode("edit");
  }

  // notif apa yakin ngedit
  // jika ya lanjut fungsi bawahnya
  function submitEdit() {
    Swal.fire({
      html: `Anda yakin mengubah <b>${edit.name}</b> ?`,
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

  // handle edit data then patch
  async function handlePatch() {
    try {
      setLoading(true);
      await axiosInstance.put(`${path}/${edit[attribute]}`, dataJson(edit));
      setTimeout(() => {
        setLoading(false);
      }, 500);
      notifySucces(`${edit.name} diubah`);
      setMode("input");
      rerender();
    } catch (err) {
      notifyError(err);
    }
  }

  // confirmation delete one data
  // if yes lanjut kode bawahnya
  function submitDelete(obj) {
    Swal.fire({
      html: `Anda yakin menghapus <b>${obj.name}</b> ?`,
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

  // handle hapus data
  async function handleDelete(obj) {
    try {
      setLoading(true);
      await axiosInstance.delete(`${path}/${obj[attribute]}`);
      notifySucces(`${obj.name} dihapus`);
      rerender();
    } catch (err) {
      notifyError(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  return (
    <div className="relative h-screen">
      <Spinner isLoading={loading} />
      <div className="grid grid-cols-4 p-10 gap-5">
        {/* Display Error Instead Input when Fetch Failed */}
        {fetchFailed ? (
          <></>
        ) : (
          <>
            {/* Input & Edit Field */}
            {mode === "input" ? (
              <div className="p-7 border-2 rounded-lg col-span-3 bg-white">
                <p className="text-xl font-bold mb-2">Tambah {title}</p>
                <div className="grid grid-cols-6 space-x-4">
                  {inputField.map((inpt) => (
                    <div key={inpt.id} className={`${inpt.width} space-y-1`}>
                      {inpt.name != "Nomor Telepon" ? (
                        <div>
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
                              setInput({
                                ...input,
                                [e.target.id]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-grey">{inpt.name}</p>
                          <input
                            id={inpt.valuefor}
                            type={inpt.type}
                            placeholder="Tidak Wajib"
                            value={input[inpt.valuefor]}
                            className="border-2 rounded-lg w-full p-2 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
                            onChange={(e) =>
                              setInput({
                                ...input,
                                [e.target.id]: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex mt-2 justify-end">
                  <Button text="Tambah" color="dark" onClick={handlePost} />
                </div>
              </div>
            ) : (
              <div className="p-7 border-2 rounded-lg col-span-3 bg-white">
                <p className="text-xl font-bold mb-2">Edit {title}</p>
                <div className="grid grid-cols-6 space-x-4">
                  {inputField.map((inpt) => (
                    <div key={inpt.id} className={`${inpt.width} space-y-1`}>
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
              rerender={rerender}
              path={path}
              deleteFile={() => {
                setExcelFile([]);
                setExcelName("");
              }}
            />
          </>
        )}

        {/* Data */}
        <div className="py-7 border-2 rounded-lg bg-white col-span-4 h-auto">
          <p className="px-7 text-xl font-bold mb-5">Daftar {title}</p>
          <div className=" overflow-x-auto">
            {/* Dropdown & Search */}
            <TableHeader
              onChange={setTerm}
              onClick={setPostPerPage}
              postsPerPage={postsPerPage}
              jsonData={currentSubClass}
              jsonName={title}
            />

            {/* If Dont Get Data Display Error Instead Of Table */}
            {fetchFailed ? (
              <Error
                type="reload"
                status={error.status}
                message={error.data.message}
              />
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="border-y text-gray-700/50 bg-gray-50">
                  <tr>
                    {inputField.map((data) => (
                      <th key={data.id} scope="col" className="pl-8 pr-4 py-3">
                        {data.name}
                      </th>
                    ))}
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubClass.map((subcls) => (
                    <tr key={subcls.sub_class_id} className="bg-white border-b">
                      {inputField.map((data) =>
                        // <key></>
                        data.id === 1 ? (
                          <td
                            key={data.id}
                            className="pl-8 pr-4 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {subcls[`${data.valuefor}`]}
                          </td>
                        ) : (
                          <td key={data.id} className="pl-8 pr-4 py-4">
                            {subcls[`${data.valuefor}`]}
                          </td>
                        )
                      )}
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
            )}

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
