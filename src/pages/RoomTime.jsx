import Papa from "papaparse";
import Button from "../components/Button";
import { ArrowUpTrayIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import TableRoomTime from "../components/RoomTime/TableRoomTime";

export default function RoomTime() {
  const handleChange = (e) => {
    const files = e.target.files;
    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          console.log("Finished:", results.data);
        },
      });
    }
  };

  return (
    <>
      {/* Import CSV Field */}
      <div className="p-7 border-2 rounded-lg col-span-1 bg-white">
        <p className="text-xl font-bold mb-2">Import CSV</p>
        <label className="flex justify-center w-full h-32 px-4 transition bg-grey-light border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-grey-dark focus:outline-none">
          <span className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="h-5" />
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

      <div className="py-7 border-2 rounded-lg bg-white col-span-4">
        <TableRoomTime />
      </div>
    </>
  );
}
