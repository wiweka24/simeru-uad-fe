import { useState, useEffect } from "react";

import { axiosInstance } from "../../atoms/config";
import { notifyError } from "../../atoms/notification";
import TableHeader from "../InputData/TableHeader";
import TablePagination from "../InputData/TablePagination";

export default function TableLecturerCredits({ update, acadyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [subClass, setSubClass] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [term, setTerm] = useState("");

  //Melakukan get data credit pengajar pada tabel lecturers berdasarkan academic year
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}lecturers/${acadyear}`);
        setSubClass(res.data.data);
      } catch (err) {
        notifyError(err);
      }
    })();
  }, [update, URL, acadyear]);

  return (
    <div className="relative py-7 overflow-x-auto">
      <p className="px-7 text-xl font-bold mb-5">Data Dosen</p>
      {/* header tabel dari template weka */}
      <TableHeader
        onChange={setTerm}
        onClick={setPostPerPage}
        postsPerPage={postsPerPage}
        jsonData={subClass}
        jsonName="Kredit-Dosen"
      />

      {/* Table credit dosen*/}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="border-y text-gray-700/50 bg-gray-50">
          <tr>
            <th scope="col" className="pl-6 pr-3 py-3">
              Id
            </th>
            <th scope="col" className="px-3 py-3">
              Dosen
            </th>
            <th scope="col" className="px-3 py-3">
              Jumlah Kelas
            </th>
            <th scope="col" className="px-3 py-3">
              Jumlah SKS
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Map data json yang didapat saat get
          (properti yang dimap lecturer_credit_id, lecturer_name, credit, sub_class_count) */}
          {currentSubClass.map((lectcredit) => (
            <tr
              key={lectcredit.lecturer_credit_id}
              className="bg-white border-b"
            >
              <td className="pl-6 pr-3 font-medium text-gray-900 whitespace-nowrap">
                {lectcredit.lecturer_credit_id}
              </td>
              <td className="px-3 py-4 cursor-default">{lectcredit.name}</td>
              <td className="px-3 py-4 cursor-default">
                {lectcredit.sub_class_count}
              </td>
              <td className="px-3 py-4 cursor-default">{lectcredit.credit}</td>
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
  );
}
