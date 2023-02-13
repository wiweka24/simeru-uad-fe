import { useState, useEffect } from "react";
import Button from "../Button";
import { Modal } from "flowbite-react";

export default function PreviewExcel({ filename, file, deleteFile }) {
  const [isShow, setIsShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [excelfile, setExcelFile] = useState([]);
  const [header, setHeader] = useState([])

  useEffect(() => {
    if (filename !== "") {
      setExcelFile(file);
      setIsShow(true);
    }
  }, [file, filename]);

  useEffect(() => {
    if (excelfile[0]) {
      setHeader(excelfile[0])
    }
  }, [excelfile]);

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
          <div className="space-x-2">
            <Button
              text="Lihat"
              color="dark"
              onClick={() => setModalShow(true)}
            />
            <Button text="Tambah" color="succes" />
            <Button
              text="❌"
              color="danger"
              onClick={() => {
                setIsShow(false);
                setExcelFile([]);
                setHeader([]);
                deleteFile();
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      <Modal show={modalShow} onClose={() => setModalShow(false)}>
        <Modal.Header>{filename}</Modal.Header>
        <Modal.Body>
          <table className="w-full text-center text-gray-500 dark:text-gray-400">
            <thead className="border text-gray-700/50 bg-gray-50">
              <tr>
                {Object.keys(header).map((header, index) => (
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
          <Button text="Tambah" color="succes" />
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
