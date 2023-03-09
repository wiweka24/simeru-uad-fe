import { useState, useEffect } from "react";

import Button from "../components/Button";
import Spinner from "../atoms/Spinner";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import TableLecturerCredits from "../components/LecturerCourse/TableLecturerCredits";
import { axiosInstance } from "../atoms/config";
import { notifyError, notifySucces } from "../atoms/notification";
import { Dropdown } from "flowbite-react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function LecturerCourse({ acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [offeredSubClass, setOfferedSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [lecturerPlot, setLecturerPlot] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [term, setTerm] = useState("");
  const [updateChild, setUpdateChild] = useState();
  const [testyear, setTestYear] = useState();

  const [loading, setLoading] = useState(true);
  const default_acyear = [1, 2, 3, 4, 5, 6];
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${URL}offered_classes/${acyear}`);
        setOfferedSubClass(res.data.data);
        console.log(acyear);
        const res1 = await axiosInstance.get(`${URL}lecturer_plot/${acyear}`);
        setLecturerPlot(res1.data.data);

        const res2 = await axiosInstance.get(`${URL}lecturer`);
        setDosen(res2.data.data);
      } catch (err) {
        notifyError(err);
      }
    })();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [updateChild, acyear]);

  useEffect(() => {
    const mergeData = offeredSubClass.map((item) => {
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id === item.sub_class_id
      );
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
          await axiosInstance.put(`${URL}lecturer_plot`, {
            data: [
              {
                lecturer_id: text.lecturer_id,
                sub_class_id: text.sub_class_id,
                academic_year_id: acyear,
              },
            ],
          });
          notifySucces("Dosen Pengampu Berhasil Ditambahkan");
          setUpdateChild(`update${Math.random()}`);
        } catch (err) {
          notifyError(err);
          setUpdateChild(`update${Math.random()}`);
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

  async function SaveYearTemplateClick() {
    const getYear = Number(acyear) - 2;
    const acadyear = `${getYear}`;

    try {
      // const res = await axiosInstance.get(`${URL}offered_classes/${acadyear}`);
      // setOfferedSubClass(res.data.data);
      // console.log("ini year");
      // console.log(acyear, "ini year sekarang");
      const res_template = await axiosInstance.get(
        `${URL}lecturer_plot/${acadyear}`
      );
      console.log(res_template.data.data);
      const template_data = res_template.data.data;
      console.log(template_data);
      const post_data = template_data.map((item) => {
        console.log(item.lecturer_id);
        let container = {};
        container.lecturer_id = Number(item.lecturer_id);
        container.sub_class_id = Number(item.sub_class_id);
        container.academic_year_id = acyear;
        return container;
      });

      try {
        await axiosInstance.post(`${URL}lecturer_plot`, {
          data: post_data,
        });
        setUpdateChild(`update${Math.random()}`);
      } catch (err) {
        notifyError(err);
      }

      // ).then ((res_template) => {
      //   if(res_template.status == 200){
      //     try{
      //       await axiosInstance.post(`${URL}lecturer_plot`, {
      //       data: [
      //         {
      //           lecturer_id: text.lecturer_id,
      //           sub_class_id: text.sub_class_id,
      //           academic_year_id: acyear,
      //         },
      //       ],
      //     });
      //     }
      //     catch{

      //     }

      //   }
      // }

      //setLecturerPlot(res_template.data.data);
      console.log(res_template.data.data);

      // const res2 = await axiosInstance.get(`${URL}lecturer`);
      //  setDosen(res2.data.data);
    } catch (err) {
      notifyError(err);
    }
  }

  function ButtonYear() {
    console.log(acyear, "ini year sekarang");
    const num = Number(acyear);

    if (acyear > 2) {
      const templateyear = num - 2;
      console.log(templateyear, " ini year yang jadi template");

      return (
        <button
          className="w-full bg-grey-light border-2 py-2 rounded-md text-grey-dark font-semibold hover:bg-sky-600 hover:text-grey-light ease duration-100"
          onClick={SaveYearTemplateClick}
        >
          Set Template
        </button>
      );
    }
    if (acyear < 3) {
      console.log("Button < 3");
      return (
        <button
          className="w-full bg-grey-light border-2 py-2 rounded-md text-grey-dark font-semibold"
          disabled
        >
          Set Template
        </button>
      );
    }
  }

  return (
    <div className="relative">
      <Spinner isLoading={loading} />
      <div className="h-10 border-b bg-white" />
      <div className="grid grid-cols-8 m-10 gap-5">
        <div className="border-2 rounded-lg bg-white col-span-5 py-7 h-max">
          <div className="relative overflow-x-auto">
            <p className="px-7 text-xl font-bold mb-5">Dosen dan Matkul</p>
            <TableHeader
              onChange={setTerm}
              onClick={setPostPerPage}
              postsPerPage={postsPerPage}
              jsonData={subClass}
            />
            <ButtonYear />
            <div className="mt-4">
              {/* <SidebarTitle text="Atur Tahun Ajaran" /> */}
              <div className="pl-2"></div>
            </div>

            {/* Table */}
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
                    <td className="px-6 py-4 cursor-default">{subcls.name}</td>
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

          {/* <TableLecturerPlot /> */}
        </div>
        <div className="border-2 rounded-lg bg-white col-span-3 h-max">
          <TableLecturerCredits update={updateChild} />
        </div>
      </div>
    </div>
  );
}
