import { useState, useEffect } from "react";

import Spinner from "../atoms/Spinner";
import Button from "../components/Button";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import { axiosInstance } from "../../src/atoms/config";
import { notifySucces } from "../../src/atoms/notification";
import { toast } from "react-toastify";

export default function CourseHelp({ acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [term, setTerm] = useState("");
  const [update, setUpdate] = useState("");
  const [offered, setOffered] = useState([]);
  const [mergeOffered, setMergeOffered] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [lecturerPlot, setLecturerPlot] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [mergeSubClass, setMergeSubClass] = useState([]);
  const [offeredID, setOfferedID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${URL}subclass`);
        setSubClass(res.data.data);

        const res1 = await axiosInstance.get(`${URL}offered_classes/${acyear}`);
        setOffered(res1.data.data);

        const res2 = await axiosInstance.get(`${URL}lecturer_plot/${acyear}`);
        setLecturerPlot(res2.data.data);
      } catch (err) {
        notifyError(err);
      }
    })();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [URL, update, acyear]);

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

  useEffect(() => {
    const mergeData = offered.map((item) => {
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id === item.sub_class_id
      );
      return {
        ...item,
        lecturer_id: lecturer ? lecturer.lecturer_id : "default",
      };
    });
    // console.log(mergeData);
    setMergeOffered(mergeData);
  }, [offered, lecturerPlot]);

  useEffect(() => {
    const mergeSubClass = subClass.map((item) => {
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id === item.sub_class_id
      );
      return {
        ...item,
        lecturer_id: lecturer ? lecturer.lecturer_id : "default",
      };
    });
    setMergeSubClass(mergeSubClass);
  }, [subClass, lecturerPlot]);

  useEffect(() => {
    setOfferedID(mergeOffered.map((item) => Number(item.sub_class_id)));
  }, [mergeOffered]);

  async function selectAll(obj) {
    let offeredData = [];
    for (const item of obj) {
      if (!offeredID.includes(item.sub_class_id)) {
        offeredData.push({
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });
      }
    }
    try {
      setLoading(true);
      await axiosInstance.post(`${URL}offered_classes`, {
        data: offeredData,
      });
      setUpdate(`update${Math.random()}`);
    } catch (err) {
      notifyError("Semua mata kuliah telah terselenggara!");
      notifyError(err.message);
      console.log(err);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  async function deselectAll(obj) {
    // console.log(obj);
    let plotData = [];
    let offeredData = [];
    for (const item of obj) {
      if (offeredID.includes(item.sub_class_id)) {
        plotData.push({
          lecturer_id: item.lecturer_id,
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });
        offeredData.push({
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });
      }
    }
    if (!plotData.length || !offeredData.length) {
      notifyError("Belum ada mata kuliah yang terselenggara!");
    } else {
      try {
        setLoading(true);
        await axiosInstance
          .delete(`${URL}lecturer_plot`, {
            data: {
              data: plotData,
            },
          })
          .then(
            await axiosInstance.delete(`${URL}offered_classes`, {
              data: {
                data: offeredData,
              },
            })
          );
        setUpdate(`update${Math.random()}`);
      } catch (err) {
        notifyError(err.message);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  async function HandleCheck(obj) {
    if (offeredID.includes(obj.sub_class_id)) {
      // console.log(obj);
      //remove item from offered list
      // const classIndex = subClass.findIndex(
      //   (item) => item.sub_class_id === obj.sub_class_id
      // );
      // const ArrRemovedItem = [...offered, subClass[classIndex]];
      // const lastElement = ArrRemovedItem.slice(-1)[0];
      // setOffered(ArrRemovedItem);
      try {
        setLoading(true);
        await axiosInstance
          .delete(`${URL}lecturer_plot`, {
            data: {
              data: [
                {
                  lecturer_id: obj.lecturer_id,
                  sub_class_id: obj.sub_class_id,
                  academic_year_id: acyear,
                },
              ],
            },
          })
          .then(
            await axiosInstance.delete(`${URL}offered_classes`, {
              data: {
                data: [
                  {
                    sub_class_id: obj.sub_class_id,
                    academic_year_id: acyear,
                  },
                ],
              },
            })
          );
        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil dihapus`);
      } catch (err) {
        notifyError(err.message);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      //add item to offered list
      // const classIndex = subClass.findIndex(
      //   (item) => item.sub_class_id === obj.sub_class_id
      // );
      // const ArrAddedItem = [...offered, subClass[classIndex]];
      // // const lastElement = ArrAddedItem.slice(-1)[0];
      // setOffered(ArrAddedItem);
      try {
        setLoading(true);
        await axiosInstance.post(`${URL}offered_classes`, {
          data: [
            {
              sub_class_id: obj.sub_class_id,
              academic_year_id: acyear,
            },
          ],
        });
        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil ditambahkan.`);
      } catch (err) {
        notifyError(err.message);
        console.log(err);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  return (
    <div className='relative'>
      <Spinner isLoading={loading} />
      <div className='h-10 border-b bg-white'></div>
      <div className='border-2 rounded-lg bg-white m-10 gap-5'>
        <div className='relative py-7 overflow-x-auto'>
          {/* Search */}
          <p className='px-7 mb-5 text-xl font-bold'>
            Mata Kuliah Terselenggara
          </p>
          <TableHeader
            onChange={setTerm}
            onClick={setPostPerPage}
            postsPerPage={postsPerPage}
            jsonData={currentSubClass}
          />
          <div className='justify-self-end grid grid-flow-col gap-4'>
            <Button
              text='Pilih Semua'
              color='dark'
              onClick={() => selectAll(mergeSubClass)}
            />
            <Button
              text='Batalkan Semua'
              color='dark'
              onClick={() => deselectAll(mergeSubClass)}
            />
          </div>
          {/*Table*/}
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='border-y text-gray-700/50 bg-gray-50'>
              <tr>
                <th scope='col' className='pl-8 pr-4 py-3'>
                  ID
                </th>
                <th scope='col' className='pl-8 pr-4 py-3'>
                  Nama Mata Kuliah
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  Semester
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  SKS
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  Terselenggara
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubClass.map((item) => (
                <tr key={item.sub_class_id} className='bg-white border-b'>
                  <td
                    scope='row'
                    className='pl-8 pr-4 py-4 font-medium text-gray-900 whitespace-nowrap'
                  >
                    {item.sub_class_id}
                  </td>
                  <td className='pl-8 pr-4'>{item.name}</td>
                  <td className='pl-8 pr-4'>{item.semester}</td>
                  <td className='pl-8 pr-4'>{item.credit}</td>
                  <td className='pl-8 pr-4 py-4 flex items-center'>
                    <input
                      className='w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2'
                      type='checkbox'
                      checked={offeredID.includes(item.sub_class_id)}
                      onChange={() => HandleCheck(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <TablePagination
            subClass={mergeSubClass}
            setCurrentSubClass={setCurrentSubClass}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            term={term}
            columnName='name'
          />
        </div>
      </div>
    </div>
  );
}
