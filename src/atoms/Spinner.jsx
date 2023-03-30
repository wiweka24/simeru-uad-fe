// import PacmanLoader from "react-spinners/PacmanLoader";
import PacmanLoader from "react-spinners/SyncLoader";

export default function Spinner({ isLoading }) {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 ${
        isLoading ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center h-screen">
        <PacmanLoader color={"#fff"} size={25} margin={2} />
      </div>
    </div>
  );
}
