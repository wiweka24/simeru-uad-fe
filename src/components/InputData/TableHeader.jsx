import { Dropdown } from "flowbite-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TableHeader({ onClick, onChange, postsPerPage }) {
  const pageNumber = ["10", "25", "50", "100"];

  return (
    <nav className="mx-8 flex mb-3 items-center justify-between">
      <Dropdown
        label={postsPerPage}
        color="dark"
        outline="true"
        className="bg-grey-light"
        size="sm"
      >
        {pageNumber.map((number) => (
          <Dropdown.Item onClick={() => onClick(number)}>
            {number}
          </Dropdown.Item>
        ))}
      </Dropdown>

      <div className="relative">
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
    </nav>
  );
}
