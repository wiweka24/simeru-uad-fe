import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../src/atoms/config";
import { notifySucces, notifyError } from "../../src/atoms/notification";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";

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

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}subclass`);
        setSubClass(res.data.data);

        const res1 = await axiosInstance.get(`${URL}offered_classes/${acyear}`);
        setOffered(res1.data.data);

        const res2 = await axiosInstance.get(`${URL}lecturer_plot/${acyear}`);
        setLecturerPlot(res2.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [update, URL]);

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
    console.log(mergeData);
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

  // console.log(subClass);
  // console.log(offered);

  // const subClassID = subClass.map((item) => item.sub_class_id);
  // const offeredID = offeredID_str.map(function (e) {
  //   return Number(e);
  // });

  // console.log(subClassID);
  // console.log(offeredID);

  async function HandleCheck(obj) {
    if (offeredID.includes(obj.sub_class_id)) {
      console.log(obj);
      //remove item from offered list
      // const classIndex = subClass.findIndex(
      //   (item) => item.sub_class_id === obj.sub_class_id
      // );
      // const ArrRemovedItem = [...offered, subClass[classIndex]];
      // const lastElement = ArrRemovedItem.slice(-1)[0];
      // setOffered(ArrRemovedItem);
      try {
        await axiosInstance.delete(
          "https://dev.bekisar.net/api/v1/offered_classes",
          {
            data: {
              data: [
                {
                  sub_class_id: obj.sub_class_id,
                  academic_year_id: 1,
                },
              ],
            },
          }
        );
        await axiosInstance.delete(
          "https://dev.bekisar.net/api/v1/lecturer_plot",
          {
            data: {
              data: [
                {
                  lecturer_id: obj.lecturer_id,
                  sub_class_id: obj.sub_class_id,
                  academic_year_id: 1,
                },
              ],
            },
          }
        );
        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil dihapus`);
      } catch (err) {
        notifyError(err.message);
      }
    } else {
      //add item to offered list
      // const classIndex = subClass.findIndex(
      //   (item) => item.sub_class_id === obj.sub_class_id
      // );
      // const ArrAddedItem = [...offered, subClass[classIndex]];
      // // const lastElement = ArrAddedItem.slice(-1)[0];
      // setOffered(ArrAddedItem);
      try {
        await axiosInstance.post(
          "https://dev.bekisar.net/api/v1/offered_classes",
          {
            data: [
              {
                sub_class_id: obj.sub_class_id,
                academic_year_id: 1,
              },
            ],
          }
        );
        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil ditambahkan.`);
      } catch (err) {
        notifyError(err.message);
        console.log(err);
      }
    }
  }

  return (
    <div className='relative py-7 overflow-x-auto'>
      {/* Search */}
      <p className='px-7 mb-5 text-xl font-bold'>Mata Kuliah Terselenggara</p>
      <TableHeader
        onChange={setTerm}
        onClick={setPostPerPage}
        postsPerPage={postsPerPage}
        jsonData={currentSubClass}
      />

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
  );
}
