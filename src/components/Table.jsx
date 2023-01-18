import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Table() {
  return (
  
  <div  className="relative overflow-x-auto">

    {/* Search */}
    <div  className="relative float-right mb-3">
      <div  className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon className="h-5"/>
      </div>
      <input 
        type="text" 
        id="table-search"  
        className="block p-2 pl-10 text-sm border-2 rounded-lg w-60 bg-grey-light focus:outline-none focus:border-2 focus:border-grey-dark/80"
        placeholder="Search for items"/>
    </div>
    

    {/* Table */}
    <table  className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead  className="text-xs border-y text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col"  className="px-6 py-3">
            Product name
          </th>
          <th scope="col"  className="px-6 py-3">
            Color
          </th>
          <th scope="col"  className="px-6 py-3">
            Category
          </th>
          <th scope="col"  className="px-6 py-3">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        <tr  className="bg-white border-b">
          <th scope="row"  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            Apple MacBook Pro 17"
          </th>
          <td  className="px-6 py-4">
            Sliver
          </td>
          <td  className="px-6 py-4">
            Laptop
          </td>
          <td  className="px-6 py-4">
            $2999
          </td>
        </tr>
      </tbody>
    </table>

    {/* Pagination */}
    <nav  className="flex mt-3 items-center justify-between" aria-label="Table navigation">
      <span  className="text-sm font-normal text-gray-500">Showing <span  className="font-semibold text-gray-900">1-10</span> of <span  className="font-semibold text-gray-900">1000</span></span>
      <ul  className="inline-flex items-center -space-x-px">
        <li>
          <a href="#"  className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
            <span  className="sr-only">Previous</span>
            <svg  className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          </a>
        </li>
        <li>
          <a href="#"  className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
        </li>
        <li>
          <a href="#"  className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
            <span  className="sr-only">Next</span>
            <svg  className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>

  )
}
