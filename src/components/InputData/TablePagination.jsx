import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
} from "@heroicons/react/24/outline"
import {useEffect} from 'react'

export default function TablePagination({currentPage, setCurrentPage, subClass, postsPerPage, setCurrentSubClass, term}) {
  const indexOfLastSubClass = Math.min(currentPage * postsPerPage, subClass.length)
  const indexOfFirstSubClass = currentPage * postsPerPage - postsPerPage
  const totalPages = Math.ceil(subClass.length / postsPerPage)

  useEffect(() => {
    setCurrentSubClass(subClass.filter(item => item.name.toLowerCase().includes(term.toLowerCase())).slice(indexOfFirstSubClass, indexOfLastSubClass))
  }, [subClass, term, indexOfFirstSubClass, indexOfLastSubClass])

  function changePage(value) {
    if (value === 'increment' && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1)
    }
    else if (value === 'decrement' && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1)
    }
  }
  
  // console.log("index awal: " + indexOfFirstSubClass + " index akhir: " + indexOfLastSubClass)

  return (
    <nav  className="mx-8 flex mt-3 items-center justify-between" aria-label="Table navigation">
      <span  className="text-sm font-normal text-gray-500">
        Data ke 
        <span  className="font-semibold text-gray-900"> {indexOfFirstSubClass + 1} - {indexOfLastSubClass} </span> 
        dari 
        <span  className="font-semibold text-gray-900"> {subClass.length} </span>
      </span>     

      <ul  className="inline-flex items-center -space-x-px">
        <li>
          <a 
            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
            onClick={() => changePage("decrement")}
          >
            <span  className="sr-only">Previous</span>
            <ChevronLeftIcon className='h-5'/>
          </a>
        </li>

        {/* Page Number - Stil Confused */}
        {/* <li>
          <a className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
        </li> */}

        <li>
          <a 
            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
            onClick={() => changePage("increment")}
          >
            <span  className="sr-only">Next</span>
            <ChevronRightIcon className='h-5'/>
          </a>
        </li>
      </ul>
    </nav>
  )
}
