import React from "react";
import CheckboxHelper from "../components/CourseHelp/CheckboxesHelper";
import { useState, useEffect } from "react";
import { axiosInstance } from "../atoms/config";
import { notifySucces, notifyError } from "../atoms/notification";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";

export default function CourseHelp({acyear}) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [term, setTerm] = useState("");
  const [update, setUpdate] = useState("");
  const [offered, setOffered] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [offeredID, setOfferedID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}subclass`);
        setSubClass(res.data.data);

        const res1 = await axiosInstance.get(
          `${URL}offered_classes/${acyear}`
        );
        setOffered(res1.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [update, acyear]);

  useEffect(() => {
    setOfferedID(offered.map((item) => Number(item.sub_class_id)));
  }, [offered]);

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
                  academic_year_id: acyear,
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
                academic_year_id: acyear,
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
    <div className="relative">
      <div className="h-10 border-b bg-white"></div>
      <div className="border-2 rounded-lg bg-white m-10 gap-5">
        <div className="relative py-7 overflow-x-auto">
          {/* Search */}
          <p className="px-7 mb-5 text-xl font-bold">
            Mata Kuliah Terselenggara
          </p>
          <TableHeader
            onChange={setTerm}
            onClick={setPostPerPage}
            postsPerPage={postsPerPage}
            jsonData={currentSubClass}
          />

          {/*Table*/}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="border-y text-gray-700/50 bg-gray-50">
              <tr>
                <th scope="col" className="pl-8 pr-4 py-3">
                  ID
                </th>
                <th scope="col" className="pl-8 pr-4 py-3">
                  Nama Mata Kuliah
                </th>
                <th scope="col" className="pl-8 pr-4">
                  Semester
                </th>
                <th scope="col" className="pl-8 pr-4">
                  SKS
                </th>
                <th scope="col" className="pl-8 pr-4">
                  Terselenggara
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubClass.map((item) => (
                <tr key={item.sub_class_id} className="bg-white border-b">
                  <td
                    scope="row"
                    className="pl-8 pr-4 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.sub_class_id}
                  </td>
                  <td className="pl-8 pr-4">{item.name}</td>
                  <td className="pl-8 pr-4">{item.semester}</td>
                  <td className="pl-8 pr-4">{item.credit}</td>
                  <td className="pl-8 pr-4 py-4 flex items-center">
                    <input
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      type="checkbox"
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
  );
}
