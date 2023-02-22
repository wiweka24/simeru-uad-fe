import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { Dropdown } from "flowbite-react";

import Button from "../Button";

export default function TableHeader({
  onClick,
  onChange,
  postsPerPage,
  jsonData,
}) {
  const pageNumber = ["10", "25", "50", "100"];

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, "data.xlsx");
  };

  return (
    <nav className="mx-8 flex mb-3 items-center justify-between">
      <Dropdown label={postsPerPage} color="dark" outline="false" size="sm">
        {pageNumber.map((number) => (
          <Dropdown.Item key={number} onClick={() => onClick(number)}>
            {number}
          </Dropdown.Item>
        ))}
      </Dropdown>

      <div className="flex items-center">
        <div className="relative mr-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
            placeholder="Cari Item"
            onChange={(e) => onChange(e.target.value.toLowerCase())}
          />
        </div>

        <Button
          text={
            <div className="flex items-center">
              <ArrowUpTrayIcon className="h-5 mr-1" />
              Export Excel
            </div>
          }
          color="dark"
          onClick={() => handleExport()}
        />
      </div>
    </nav>
  );
}
