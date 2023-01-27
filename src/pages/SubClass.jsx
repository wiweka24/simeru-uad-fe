import Papa from "papaparse"
import Button from "../components/Button"
import { ArrowUpTrayIcon, PlusSmallIcon } from "@heroicons/react/24/outline"
import Table from "../components/Table"
import { useState } from "react"

export default function SubClass() {

  const [input, setInput] = useState({
    "name": "",
    "quota": 32,
    "credit": 3,
    "semester": 1
  })

  const inputField = [
    {
      id: 1,
      name: "Nama",
      placeholder: "Masukkan nama matkul",
      valuefor: "name",
      type: "text",
      width: "3"
    },
    {
      id: 2,
      name: "Semester",
      placeholder: "1",
      valuefor: "semester",
      type: "number",
      width: "1"
    },
    {
      id: 3,
      name: "SKS",
      placeholder: "3",
      valuefor: "credit",
      type: "number",
      width: "1"
    },
    {
      id: 4,
      name: "Kuota",
      placeholder: "32",
      valuefor: "quota",
      type: "number",
      width: "1"
    }
  ]

  const handleChange = (e) => {
    const files = e.target.files
    if (files) {
      Papa.parse(files[0], {
        complete: function(results) {
          console.log("Finished:", results.data)
        }}
      )
    }
  }

  return (
    <div className="relative">
      <div className="h-10 border-b bg-white"></div>
      <div className="grid grid-cols-4 m-10 gap-5">
        <div className="p-7 border-2 rounded-lg col-span-3 bg-white">
          <p className="text-xl font-bold mb-2">Tambah Matkul</p>
          
          {/* Input Field */}
          <div className="grid grid-cols-6 space-x-4">
          {
            inputField.map((inpt) => (
              <div 
                key={inpt.id}
                className={`col-span-${inpt.width} space-y-1`}
              >
                <p className="text-grey">
                  {inpt.name}
                  <span className="text-red-500">*</span>
                </p>

                <input
                  id={inpt.valuefor}
                  type={inpt.type}
                  placeholder={inpt.placeholder}
                  value={input[inpt.valuefor]}
                  className="border-2 rounded-lg w-full p-2 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
                  onChange={(e) => setInput({...input, [e.target.id]: e.target.value})}
                  />
              </div>
            ))
          }
          </div>

          <div className="flex justify-end">
            <Button
              text = "Add"
              Icon = {PlusSmallIcon}
              linkto = "/"
            />
          </div>
        </div>
          
        {/* Import CSV Field */}
        <div className="p-7 border-2 rounded-lg col-span-1 bg-white">
          <p className="text-xl font-bold mb-2">Import CSV</p>
          <label
            className="flex justify-center w-full h-32 px-4 transition bg-grey-light border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-grey-dark focus:outline-none">
            <span className="flex items-center space-x-2">
              <ArrowUpTrayIcon className="h-5"/>
              <span className="font-medium text-gray-600">
                Drop file di sini, atau
                <span className="text-blue-600"> cari</span>
              </span>
            </span>
            <input 
              type="file" 
              name="file_upload" 
              className="hidden"
              accept=".csv"
              onChange={handleChange}
            />
          </label>
        </div>
        
        <div className="py-7 border-2 rounded-lg bg-white col-span-4 h-auto">
          <Table/>
        </div>
      </div>
    </div>
  )
}
