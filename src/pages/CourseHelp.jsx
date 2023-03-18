// Kode untuk halaman MKTerselenggara, dapat diakses melalui rute /MKTerselenggara dan tombol 'Matkul Terselenggara'
// EN: Code for MKTerselenggara, accessible from a route, /MKTerselenggara and a button, 'Matkul Terselenggara'

// Melakukan import library
// EN: Importing libraries
import { useState, useEffect } from "react";
import Spinner from "../atoms/Spinner";
import Error from "./Error";
import Button from "../components/Button";
import TableHeader from "../components/InputData/TableHeader";
import TablePagination from "../components/InputData/TablePagination";
import { axiosInstance } from "../../src/atoms/config";
import { notifySucces } from "../../src/atoms/notification";
import { toast } from "react-toastify";

// Melakukan export fungsi halaman MKTerselenggara bernama CourseHelp
// EN: Exporting whole page, MKTerselenggara with the name CourseHelp
export default function CourseHelp({ acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [term, setTerm] = useState("");
  const [update, setUpdate] = useState("");
  const [offered, setOffered] = useState([]);
  const [mergeOffered, setMergeOffered] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [lecturerPlot, setLecturerPlot] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [mergeSubClass, setMergeSubClass] = useState([]);
  const [offeredID, setOfferedID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [tooLongReq, setTooLongReq] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Melakukan request GET semua matkul (subclass)
        // EN: GET request for all classes (subclass)
        const res = await axiosInstance.get(`${URL}subclass`);
        setSubClass(res.data.data);

        // Melakukan request GET semua matkul yang ditawarkan (offered classes)
        // EN: GET request for all classes (offered classes)
        const res1 = await axiosInstance.get(`${URL}offered_classes/${acyear}`);
        setOffered(res1.data.data); // Set state to offered
        const res2 = await axiosInstance.get(`${URL}lecturer_plot/${acyear}`);
        setLecturerPlot(res2.data.data); // Set state to lecturerPlot

        // Catch error dan keluarkan notifikasi toast
        // EN: Catch error(s) and show toast notification
      } catch (err) {
        setTooLongReq(true);
        notifyError(err);
      } finally {
        setLoading(false);
      }
    })();
    // Mengatur waktu timeout
    // EN: Set timeout duration
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [URL, update, acyear]);

  // Fungsi notifikasi toast: error
  // EN: Function for toast notification: error
  function notifyError(message) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  useEffect(() => {
    // Melakukan mapping data (offered) yang sudah di-GET di atas. mergeData adalah hasil merging dua objek JSON, offered dan lecturerPlot
    // EN: Map data (offered) from GET request above. mergeData is the result of merging two JSON objects, offered and lecturerPlot
    const mergeData = offered.map((item) => {
      // Melakukan merge dua object pada variabel sub_class_id, menambahkan lecturer_id dari lecturerPlot
      // EN: Merging two JSON objects on sub_class_id, adding lecturer_id from lecturerPlot
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id === item.sub_class_id
      );
      return {
        ...item,
        lecturer_id: lecturer ? lecturer.lecturer_id : "default",
      };
    });
    //Mengisi state mergeOffered dengan variabel mergeData
    //EN: Set mergeData as state for mergeOffered
    setMergeOffered(mergeData);
  }, [offered, lecturerPlot]);

  useEffect(() => {
    // Melakukan mapping data (subClass) yang sudah di-GET di atas. mergeSubClass adalah hasil merging dua objek JSON, subClass dan lecturerPlot
    // EN: Map data (subClass) from GET request above. mergeSubClass is the result of merging two JSON objects, subClass and lecturerPlot
    const mergeClassData = subClass.map((item) => {
      // Melakukan merge dua object pada variabel sub_class_id, menambahkan lecturer_id dari lecturerPlot
      // EN: Merging two JSON objects on sub_class_id, adding lecturer_id from lecturerPlot
      const lecturer = lecturerPlot.find(
        (item2) => item2.sub_class_id === item.sub_class_id
      );
      return {
        ...item,
        lecturer_id: lecturer ? lecturer.lecturer_id : "default",
      };
    });
    //Mengisi state mergeSubClass dengan variabel mergeClassData
    //EN: Set mergeClassData as state for mergeSubClass
    setMergeSubClass(mergeClassData);
  }, [subClass, lecturerPlot]);

  // Melakukan mapping sub_class_id milik data mergeOffered, disimpan pada offeredID
  // EN: Mapping sub_class_id from mergeOffered, saved in offeredID
  useEffect(() => {
    setOfferedID(mergeOffered.map((item) => Number(item.sub_class_id)));
  }, [mergeOffered]);

  // Fungsi untuk memilih semua mata kuliah, digunakan oleh button 'Pilih Semua'
  // EN: Function to select all classes, used by button: 'Pilih Semua'/'Select All'
  async function selectAll(obj) {
    let offeredData = []; // EN: Create new empty array to fill with classes to be offered.
    for (const item of obj) {
      // EN: obj is mergeSubClass, passed from onClick function call below (Line 300-ish)
      if (!offeredID.includes(item.sub_class_id)) {
        // EN: Check if each sub_class_id from obj does NOT exist in offeredID.
        // Jika item ada di obj tetapi tidak ada di offeredID, artinya item tersebut merupakan matkul yang tidak terselenggara.
        // EN: If an item exists in obj but not in offeredID, it means that said item isn't one of the offered classes.

        // Setiap sub_class_id yang tidak ada di offeredID akan di-push oleh selectAll, yang berarti menyelenggarakan matkul tersebut.
        // EN: For every sub_class_id that doesn't exist in offeredID, selectAll will push data from mergeSubClass, therefore offering the class.
        offeredData.push({
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });
      }
    }

    try {
      setLoading(true);
      // Request POST ke endpoint matkul terselenggara (offered_classes) menggunakan offeredData. offeredData hanya berisi matkul yang belum terselenggara.
      // EN: POST request to offered_classes endpoint with offeredData. offeredData contains ONLY classes that are NOT offered yet.
      await axiosInstance.post(`${URL}offered_classes`, {
        data: offeredData,
      });
      setUpdate(`update${Math.random()}`);
      // Mengeluarkan error jika semua mata kuliah telah terselenggara.
      // EN: Throws an error if every class has been offered.
    } catch (err) {
      notifyError("Semua mata kuliah telah terselenggara!");
      notifyError(err.message);

      console.log(err);
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  // Fungsi untuk membatalkan semua mata kuliah, digunakan oleh button 'Batlkan Semua'
  // EN: Function to deselect/cancel all classes, used by button: 'Batalkan Semua' / 'Deselect All'
  async function deselectAll(obj) {
    let plotData = []; // EN: Create empty array to fill with lecturer plot data to delete.
    let offeredData = []; // EN: Create empty array to fill with offered classes data to cancel.
    for (const item of obj) {
      // EN: obj is mergeSubClass, passed from onClick function call below (Line 300-ish)
      if (offeredID.includes(item.sub_class_id)) {
        // EN: Check if each sub_class_id from obj also exists in offeredID.
        // Jika item ada di obj dan di offeredID, artinya item tersebut merupakan matkul yang terselenggara.
        // EN: If an item exists in obj and in offeredID, it means that said item is one of the offered classes.

        // Setiap sub_class_id yang ada di offeredID akan di-push oleh deselectAll, yang berarti semua plot dosen-matkul akan dihaps.
        // EN: For every sub_class_id that exists in offeredID, deselectAll will push data from mergeSubClass, deleting all lecturer plots.
        plotData.push({
          // EN: Push existing lecturer plot data to plotData array to be deleted
          lecturer_id: item.lecturer_id,
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });

        // Setiap sub_class_id yang ada di offeredID akan di-push oleh deselectAll, yang berarti semua matkul terselenggara akan dihaps.
        // EN: For every sub_class_id that exists in offeredID, deselectAll will push data from mergeSubClass, canceling all offered classes.
        offeredData.push({
          // EN: Push existing offered classes data to offeredData array to be canceled
          sub_class_id: item.sub_class_id,
          academic_year_id: acyear,
        });
      }
    }
    // Jika plotData atau offeredData kosong, yang berarti tidak ada data untuk di-DELETE, keluarkan error
    // EN: Throws error if plotData or offeredData is empty, which means no pre-existing data exists, therefore there is nothing to DELETE.
    if (!plotData.length || !offeredData.length) {
      notifyError("Belum ada mata kuliah yang terselenggara!");
    } else {
      // Runs when plotData and offeredData aren't empty
      try {
        setLoading(true);

        // Request DELETE untuk menghapus semua data lecturer_plot
        // EN: DELETE request to, well, delete all data from lecturer_plot
        await axiosInstance
          .delete(`${URL}lecturer_plot`, {
            data: {
              data: plotData,
            },
          })
          .then(
            // EN: Runs after lecturer_plot DELETE request is complete.

            // Request DELETE untuk menghapus semua data offered_classes (membatalkan semua kelas)
            // EN: DELETE request to delete all data from offered_classes (canceling all classes)
            await axiosInstance.delete(`${URL}offered_classes`, {
              data: {
                data: offeredData,
              },
            })
          );

        setUpdate(`update${Math.random()}`);
      } catch (err) {
        notifyError(err.message);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  // Fungsi yang meng-handle jika user melakukan klik checkbox satu matkul
  // EN: Function that handles the clicking of a single offered class checkbox
  async function HandleCheck(obj) {
    if (offeredID.includes(obj.sub_class_id)) {
      // Jika item ada di obj dan di offeredID, artinya item tersebut merupakan matkul yang terselenggara.
      // EN: If an item exists in obj and in offeredID, it means that said item is one of the offered classes.

      // Matkul yang terselenggara tersebut (terdapat di offeredID) akan dihapus dengan request DELETE di bawah, yang berarti membatalkan matkul tersebut.
      // EN: The class that is offered (exists in offeredID) will be deleted with the DELETE request below, canceling the class.
      try {
        setLoading(true);

        await axiosInstance
          .delete(`${URL}lecturer_plot`, {
            data: {
              data: [
                {
                  lecturer_id: obj.lecturer_id,
                  sub_class_id: obj.sub_class_id,
                  academic_year_id: acyear,
                },
              ],
            },
          })

          .then(
            await axiosInstance.delete(`${URL}offered_classes`, {
              data: {
                data: [
                  {
                    sub_class_id: obj.sub_class_id,
                    academic_year_id: acyear,
                  },
                ],
              },
            })
          );

        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil dihapus`);
      } catch (err) {
        notifyError(err.message);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      //add item to offered list
      // const classIndex = subClass.findIndex(
      //   (item) => item.sub_class_id === obj.sub_class_id
      // );
      // const ArrAddedItem = [...offered, subClass[classIndex]];
      // // const lastElement = ArrAddedItem.slice(-1)[0];
      // setOffered(ArrAddedItem);
      try {
        setLoading(true);
        await axiosInstance.post(`${URL}offered_classes`, {
          data: [
            {
              sub_class_id: obj.sub_class_id,
              academic_year_id: acyear,
            },
          ],
        });
        setUpdate(`update${Math.random()}`);
        notifySucces(`Mata kuliah ${obj.name} berhasil ditambahkan.`);
      } catch (err) {
        setTooLongReq(true);
        notifyError(err.message);
        console.log(err);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  return (
    <div className='relative'>
      <Spinner isLoading={loading} />
      <div className='h-10 border-b bg-white'></div>
      <div className='border-2 rounded-lg bg-white m-10 gap-5'>
        <div className='relative py-7 overflow-x-auto'>
          <p className='px-7 mb-5 text-xl font-bold'>
            Mata Kuliah Terselenggara
          </p>
          <div className="justify-start mx-8 flex mb-3 gap-2	">
            <Button
              text="Pilih Semua"
              color="dark"
              color1="succes"
              onClick={() => selectAll(mergeSubClass)}
            />
            <Button
              text="Batalkan Semua"
              color="dark"
              color1="danger"
              onClick={() => deselectAll(mergeSubClass)}
            />
          </div>
          <TableHeader
            onChange={setTerm}
            onClick={setPostPerPage}
            postsPerPage={postsPerPage}
            jsonData={currentSubClass}
          />
          {/*Table*/}
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='border-y text-gray-700/50 bg-gray-50'>
              <tr>
                <th scope='col' className='pl-8 pr-4 py-3'>
                  ID
                </th>
                <th scope='col' className='pl-8 pr-4 py-3'>
                  Nama Mata Kuliah
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  Semester
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  SKS
                </th>
                <th scope='col' className='pl-8 pr-4'>
                  Terselenggara
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubClass.map((item) => (
                <tr key={item.sub_class_id} className='bg-white border-b'>
                  <td className='pl-8 pr-4 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    {item.sub_class_id}
                  </td>
                  <td className='pl-8 pr-4'>{item.name}</td>
                  <td className='pl-8 pr-4'>{item.semester}</td>
                  <td className='pl-8 pr-4'>{item.credit}</td>
                  <td className='pl-8 pr-4 py-4 flex items-center'>
                    <input
                      className='w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2'
                      type='checkbox'
                      checked={offeredID.includes(item.sub_class_id)}
                      onChange={() => HandleCheck(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <TablePagination
            subClass={mergeSubClass}
            setCurrentSubClass={setCurrentSubClass}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            term={term}
            columnName='name'
          />
        </div>
      </div>
    </div>
  );
}
