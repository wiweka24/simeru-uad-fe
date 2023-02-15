import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
import { Dropdown } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function CheckboxHelper() {
  const [update, setUpdate] = useState("");
  const [offered, setOffered] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);

  const indexOfLastSubClass = currentPage * postsPerPage;
  const indexOfFirstSubClass = indexOfLastSubClass - postsPerPage;
  const currentSubClass = subClass.slice(
    indexOfFirstSubClass,
    indexOfLastSubClass
  );
  const totalPages = Math.ceil(subClass.length / postsPerPage);
  const pageNumber = ["10", "25", "50", "100"];

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/subclass"
        );
        setSubClass(res.data.data);

        const res1 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/offered_classes/1"
        );
        setOffered(res1.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [update]);

  function changePage(value) {
    if (value === "increment" && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1);
    } else if (value === "decrement" && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1);
    }
  }

  console.log(subClass);
  console.log(offered);
  const offeredID_str = offered.map((item) => item.sub_class_id);
  const subClassID = subClass.map((item) => item.sub_class_id);

  const offeredID = offeredID_str.map(function (e) {
    return Number(e);
  });

  console.log(subClassID);
  console.log(offeredID);

  const HandleCheck = (id) => {
    if (offeredID.includes(id)) {
      //remove item from offered list
      const classIndex = subClass.findIndex((item) => item.sub_class_id === id);
      const ArrRemovedItem = [...offered, subClass[classIndex]];
      const lastElement = ArrRemovedItem.slice(-1)[0];
      setOffered(ArrRemovedItem);
      (async () => {
        try {
          const res = await axiosInstance.delete(
            "https://dev.bekisar.net/api/v1/offered_classes",
            {
              data: {
                data: [
                  {
                    sub_class_id: lastElement.sub_class_id,
                    academic_year_id: 1,
                  },
                ],
              },
            }
          );
          setUpdate(`update${Math.random()}`);
        } catch (err) {
          console.log(err);
        }
      })();
    } else {
      //add item to offered list
      const classIndex = subClass.findIndex((item) => item.sub_class_id === id);
      const ArrAddedItem = [...offered, subClass[classIndex]];
      const lastElement = ArrAddedItem.slice(-1)[0];
      setOffered(ArrAddedItem);
      (async () => {
        try {
          const res1 = await axiosInstance.post(
            "https://dev.bekisar.net/api/v1/offered_classes",
            {
              data: [
                {
                  sub_class_id: lastElement.sub_class_id,
                  academic_year_id: lastElement.academic_year_id,
                },
              ],
            }
          );
          setUpdate(`update${Math.random()}`);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  };

  return (
    <div className='relative overflow-x-auto'>
      {/* Search */}
      <p className=' text-xl font-bold mx-4 my-4'>Mata Kuliah Terselenggara</p>
      <nav className='mx-8 flex mb-3 items-center justify-between'>
        <Dropdown
          label={postsPerPage}
          color='dark'
          outline='true'
          className='bg-grey-light'
        >
          {pageNumber.map((number) => (
            <Dropdown.Item onClick={() => setPostPerPage(number)}>
              {number}
            </Dropdown.Item>
          ))}
        </Dropdown>

        <div className='relative mx-20'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <MagnifyingGlassIcon className='h-5' />
          </div>
          <input
            type='text'
            id='table-search'
            className='block p-2 pl-10 text-sm border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80'
            placeholder='Search for items'
          />
        </div>
      </nav>

      {/*Table*/}
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='border-y text-gray-700/50 bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              ID
            </th>
            <th scope='col' className='pl-8 pr-6 py-3'>
              Nama Mata Kuliah
            </th>
            <th scope='col' className='px-6 py-3'>
              Semester
            </th>
            <th scope='col' className='px-6 py-3'>
              SKS
            </th>
            <th scope='col' className='px-6 py-3'>
              Terselenggara
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSubClass.map((item) => (
            <tr key={item.sub_class_id} className='bg-white border-b'>
              <th
                scope='row'
                className='pl-8 pr-6 py-4 font-medium text-gray-900 whitespace-nowrap'
              >
                {item.sub_class_id}
              </th>
              <td className='px-6 py-4'>{item.name}</td>
              <td className='px-6 py-4'>{item.semester}</td>
              <td className='px-6 py-4'>{item.credit}</td>
              <td>
                <div className='mt-1 flex items-start flex-col space-y-11'>
                  <input
                    className='w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    type='checkbox'
                    value={item.sub_class_id}
                    checked={offeredID.includes(item.sub_class_id)}
                    onChange={() => HandleCheck(item.sub_class_id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        className='mx-8 flex mt-3 items-center justify-between'
        aria-label='Table navigation'
      >
        <span className='text-sm font-normal text-gray-500'>
          Data
          <span className='font-semibold text-gray-900'>
            {" "}
            {indexOfFirstSubClass + 1} - {indexOfLastSubClass}{" "}
          </span>
          dari
          <span className='font-semibold text-gray-900'>
            {" "}
            {subClass.length}{" "}
          </span>
        </span>

        <ul className='inline-flex items-center -space-x-px'>
          <li>
            <a
              className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700'
              onClick={() => changePage("decrement")}
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon className='h-5' />
            </a>
          </li>

          {/* Page Number - Stil Confused */}
          {/* <li>
          <a className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
        </li> */}

          <li>
            <a
              className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700'
              onClick={() => changePage("increment")}
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon className='h-5' />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
