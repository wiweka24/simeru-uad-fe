import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
import { Dropdown } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function TableLecturerCredits() {
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
        const res = await axiosInstance.get("dummy_data/dosen.json");
        setSubClass(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  console.log(subClass);

  function changePage(value) {
    if (value === "increment" && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1);
    } else if (value === "decrement" && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1);
    }
  }

  return (
    <div className='relative overflow-x-auto'>
      {/* Search */}
      <p className=' text-xl font-bold mx-4 my-4'>Data Dosen</p>
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

      {/* Table */}
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='border-y text-gray-700/50 bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Id
            </th>
            <th scope='col' className='pl-8 pr-6 py-3'>
              Dosen
            </th>
            <th scope='col' className='px-6 py-3'>
              Jadwal Kelas
            </th>
            <th scope='col' className='px-6 py-3'>
              Jumlah SKS
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSubClass.map((subcls) => (
            <tr key={subcls.lecturer_id} className='bg-white border-b'>
              <th
                scope='row'
                className='pl-8 pr-6 py-4 font-medium text-gray-900 whitespace-nowrap'
              >
                {subcls.name}
              </th>
              <td className='px-6 py-4'>{subcls.academic_year_id}</td>
              <td className='px-6 py-4'>{subcls.credit}</td>
              <td className='px-6 py-4'>{subcls.sub_class_count}</td>
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
