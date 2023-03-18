import { useState, useEffect } from "react";

import { Modal } from "flowbite-react";

import Button from "../Button";
import { axiosInstance } from "../../atoms/config";
import {
  notifyError,
  notifySucces,
  scheduleError,
} from "../../atoms/notification";
import Schedule from "../../pages/Schedule";

export default function PreviewExcel({
  filename,
  file,
  deleteFile,
  rerender,
  path,
  URL,
}) {
  const [isShow, setIsShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [excelfile, setExcelFile] = useState([]);
  const [header, setHeader] = useState([]);
  const [notif, setNotif] = useState("");

  function correctHeader(path) {
    if (path === "subclass") {
      return ["name", "quota", "credit", "semester"];
    } else if (path === "lecturer") {
      return ["name", "email", "phone_number"];
    } else {
      return ["name", "quota"];
    }
  }

  useEffect(() => {
    if (filename !== "") {
      setExcelFile(file);
      setIsShow(true);
    }
  }, [file, filename]);

  useEffect(() => {
    if (excelfile[0]) {
      setHeader(Object.keys(excelfile[0]));
    } else {
      setHeader([]);
    }
  }, [excelfile]);

  useEffect(() => {
    const testHeader = header.slice();
    if (
      testHeader.sort().toString() !== correctHeader(path).sort().toString()
    ) {
      setNotif(
        <p className="text-red-600">
          * Header tabel salah, Header harus terdiri dari:{" "}
          <b>
            {correctHeader(path).map((header) => (
              <span>"{header}", </span>
            ))}
          </b>
        </p>
      );
    } else {
      setNotif("");
    }
  }, [header]);

  async function handlePostExcel() {
    try {
      console.log(excelfile);
      await axiosInstance.post(URL, {
        data: excelfile,
      });
      setModalShow(false);
      notifySucces(`data dari ${filename} ditambahkan`);
      rerender();
      resetExcel();
    } catch (err) {
      // for (let data of err.response.data.errors) {
      //   console.log(data);
      // }
      console.log(err.response.data)
      console.log(err.response.data.errors)
      notifyError(err);
    }
  }

  function resetExcel() {
    setIsShow(false);
    setExcelFile([]);
    setHeader([]);
    setNotif("");
    deleteFile();
  }

  return (
    <>
      {isShow ? (
        <div className="flex p-7 border-2 rounded-lg bg-white col-span-4 h-auto justify-between">
          <div className="flex space-x-2 items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2504/2504768.png"
              className="h-9"
              alt="excel_icon"
            />
            <span>{filename}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              text="Lihat"
              color="dark"
              onClick={() => setModalShow(true)}
            />
            <Button text="Tambah" color="succes" onClick={handlePostExcel} />
            <Button text="❌" color="danger" onClick={resetExcel} />
          </div>
        </div>
      ) : (
        <></>
      )}

      <Modal show={modalShow} onClose={() => setModalShow(false)}>
        <Modal.Header>{filename}</Modal.Header>
        <Modal.Body className="max-h-96 overflow-y-scroll">
          {notif}
          <table className="w-full text-center text-gray-500 dark:text-gray-400">
            <thead className="border text-gray-700/50 bg-gray-50">
              <tr>
                {header.map((header, index) => (
                  <th scope="col" key={index}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              scope="row"
              className="border text-gray-900 whitespace-nowrap"
            >
              {excelfile.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, index) => (
                    <td className="border" key={index}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          {notif === "" ? (
            <Button text="Tambah" color="succes" onClick={handlePostExcel} />
          ) : (
            <></>
          )}
          <Button
            text="Tutup"
            color="danger"
            onClick={() => setModalShow(false)}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
