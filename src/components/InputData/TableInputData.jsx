import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";

export default function TableInputData() {
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const URL = process.env.REACT_APP_BASE_URL + "subclass";

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/matkul.json");
        setSubClass(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  return (
    <div className=" overflow-x-auto">
      {/* Dropdown & Search */}
      <TableHeader
        onChange={setTerm}
        onClick={setPostPerPage}
        postsPerPage={postsPerPage}
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
      />
    </div>
  );
}
