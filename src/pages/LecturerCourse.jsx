import { useState, useEffect } from "react";

import Button from "../components/Button";
import Spinner from "../atoms/Spinner";
import Error from "./Error";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import TableLecturerCredits from "../components/LecturerCourse/TableLecturerCredits";
import { axiosInstance } from "../atoms/config";
import { notifyError, notifySucces } from "../atoms/notification";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function LecturerCourse({ acyear }) {
  const [offeredSubClass, setOfferedSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [lecturerPlot, setLecturerPlot] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [update, setUpdate] = useState();
  const [fetchFailed, setFetchFailed] = useState(false);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  // Get data data yang dibutuhkan di tabel lecturer Course
  //(offered class) kelas terselenggara, (lecturer_plot) jadwal dosen, dan (dosen)lecturer)
  //Use effect akan rerender jika terdapat update value pada acyear atau updateChild
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [res, res1, res2] = await Promise.all([
          axiosInstance.get(`offered_classes/${acyear}`),
          axiosInstance.get(`lecturer_plot/${acyear}`),
          axiosInstance.get(`lecturer`),
        ]);

        setOfferedSubClass(res.data.data);
        setLecturerPlot(res1.data.data);
        setDosen(res2.data.data);
      } catch (err) {
        setFetchFailed(true);
        setError(err.response);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    })();
  }, [update, acyear]);

  // Melakukan merge tabel antara tabel offered subclass dan lecturerplot
  useEffect(() => {
    // Map offeredsubclass
    const mergeData = offeredSubClass.map((item) => {
      // find data pada lecturerplot yang memiliki subclass_id yang sama antara lecturer plot dan offered subclass
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id == item.sub_class_id
      );
      //Cek apakah lecturer name sudah ada/belum
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

      async function handleSaveClick() {
        setMode("read");
        try {
          await axiosInstance.put(`lecturer_plot`, {
            data: [
              {
                lecturer_id: text.lecturer_id,
                sub_class_id: text.sub_class_id,
                academic_year_id: acyear,
              },
            ],
          });
          notifySucces("Dosen Pengampu Berhasil Ditambahkan");
          rerender();
        } catch (err) {
          notifyError(err);
          rerender();
        }
      }

      return (
        <div className=" input-group relative flex flex-nowrap space-x-1 py-1">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={dosen}
            getOptionLabel={(option) =>
              option.name ? option.name : text.lecturer_name
            }
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" size="small" />
            )}
            type="text"
            className="text-sm border-2 rounded-lg w-60 bg-grey-light"
            value={text.lecturer_name}
            onChange={(e, label) => handleInputChange(e, label)}
          />
          <Button text="ok" color="succes" onClick={handleSaveClick} />
        </div>
      );
    }
    if (mode === "read") {
      function handleEditClick() {
        setMode("edit");
      }
      if (text.lecturer_name === "Mohon Isi Dosen") {
        return (
          <div className="font-bold text-red-500 " onClick={handleEditClick}>
            "Mohon Isi Dosen"
          </div>
        );
      }
      return <div onClick={handleEditClick}>{text.lecturer_name}</div>;
    }
  }

  return (
    <div className="relative h-screen">
      <Spinner isLoading={loading} />
      <div className="grid grid-cols-8 p-10 gap-5">
        <div
          className={`${
            fetchFailed ? "col-span-8" : "col-span-5"
          } border-2 rounded-lg bg-white py-7`}
        >
          <div className="relative overflow-x-auto">
            <p className="px-7 text-xl font-bold mb-5">Dosen dan Matkul</p>
            <TableHeader
              onChange={setTerm}
              onClick={setPostPerPage}
              postsPerPage={postsPerPage}
              jsonData={subClass}
              jsonName="Mata-Kuliah-Dengan-Dosen-Pengampu-Terselenggara"
            />
            <div className="mt-4">
              {/* <SidebarTitle text="Atur Tahun Ajaran" /> */}
              <div className="pl-2"></div>
            </div>

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
                    <th scope="col" className="pl-8 pr-6 py-3">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nama Matkul
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Semester
                    </th>
                    <th scope="col" className="px-6 py-3">
                      SKS
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
                        {subcls.name}
                      </td>
                      <td className="px-6 py-4 cursor-default">
                        {subcls.semester}
                      </td>
                      <td className="px-6 py-4 cursor-default">
                        {subcls.credit}
                      </td>
                      <td className="pl-6 cursor-pointer">
                        <Cell value={subcls} />
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

        {/* <TableLecturerPlot /> */}
        {/* if fetch failed dont display table 2 */}
        {fetchFailed ? (
          <></>
        ) : (
          <div className="border-2 rounded-lg bg-white col-span-3 h-max">
            <TableLecturerCredits update={update} acadyear={acyear} />
          </div>
        )}
      </div>
    </div>
  );
}
