import { Link } from "react-router-dom";

export default function Error({ redirect, message, type, status }) {
  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <section className="flex items-center h-full my-auto p-16">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl">
            <span className="sr-only">Error</span>
            {status || 404}
          </h2>
          <p className="text-2xl mb-8 font-semibold md:text-3xl">{message}</p>
          {/* <p className="mt-4 mb-8 dark:text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p> */}
          {type === "reload" ? (
            <Link
              onClick={() => refreshPage()}
              className="px-8 py-3 font-semibold rounded underline"
            >
              Tunggu Sebentar lalu Klik Untuk Reload
            </Link>
          ) : (
            <Link
              to={redirect}
              className="px-8 py-3 font-semibold rounded underline"
            >
              Klik untuk Kembali ke Homepage
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
