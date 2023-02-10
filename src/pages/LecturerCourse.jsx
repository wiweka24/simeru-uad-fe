import { TableContext } from "flowbite-react/lib/esm/components/Table/TableContext";
import React from "react";
import TableLecturerCredits from "../components/LecturerCourse/TableLecturerCredits";
import TableLecturerPlot from "../components/LecturerCourse/TableLecturerPlot";

export default function LecturerCourse() {
  return (
    <div className="grid grid-cols-6 m-10 gap-5">
      <div className=" border-2 rounded-lg bg-white col-span-4 py-5">
        <TableLecturerPlot />
      </div>
      <div className=" border-2 rounded-lg bg-white col-span-2">
        <TableLecturerCredits />
      </div>
    </div>
  );
}
