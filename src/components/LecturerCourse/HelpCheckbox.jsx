import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";

export default function HelpCheckbox({ value, onChange }) {
  const [isCheck, setIsCheck] = useState(false);
  const { subClass, setSubClass } = useState({});
  const { offered, setOffered } = useState({});
  // subClass useEffect
  useEffect(() => {}, []);

  // const HandleCheck = (id, obj) => {
  //   const offeredID = offered.map((item) => item.sub_class_id);
  //   console.log(offeredID);
  //   // case if class is already offered
  //   if (offeredID.includes(id)) {
  //     const onlySubClass = offered.filter((item) => {
  //       return item.sub_class_id !== id;
  //     });
  //     setOffered(onlySubClass);
  //     console.log(offered);
  //     setIsCheck(false);
  //     (async () => {
  //       try {
  //         await axiosInstance.delete(
  //           "https://dev.bekisar.net/api/v1/offered_classes",
  //           {
  //             data: [
  //               {
  //                 sub_class_id: obj.sub_class_id,
  //                 academic_year_id: obj.academic_year_id,
  //               },
  //             ],
  //           }
  //         );
  //         setIsCheck(false);
  //         onChange();
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     })();
  //   } else {
  //     const subClassIndex = subClass.findIndex(
  //       (item) => item.sub_class_id === id
  //     );
  //     const newOffered = [...offered, subClass[subClassIndex]];
  //     setOffered(newOffered);
  //     console.log(offered);
  //     setIsCheck(true);
  //     (async () => {
  //       try {
  //         await axiosInstance.post(
  //           "https://dev.bekisar.net/api/v1/offered_classes",
  //           {
  //             data: [
  //               {
  //                 sub_class_id: obj.sub_class_id,
  //                 academic_year_id: obj.academic_year_id,
  //               },
  //             ],
  //           }
  //         );
  //         setIsCheck(true);
  //         onChange();
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     })();
  //   }
  // };

  return (
    <>
      <div class='flex items-center mr-4'>
        <input
          checked={isCheck}
          type='checkbox'
          // onChange={() => HandleCheck(value)}
          className='w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
        ></input>
      </div>
    </>
  );
}
