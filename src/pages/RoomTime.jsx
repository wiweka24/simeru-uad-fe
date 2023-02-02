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
      <div className="py-7 border-2 rounded-lg bg-white col-span-4 m-10">
        <TableRoomTime />
      </div>
    </>
  );
}
