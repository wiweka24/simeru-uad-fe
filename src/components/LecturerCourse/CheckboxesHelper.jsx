import React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";

export default function CheckboxHelper() {
  const [update, setUpdate] = useState("");
  const [offered, setOffered] = useState([]);
  const [subClass, setSubClass] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/subclass"
        );
        setSubClass(res.data.data);

        const res1 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/offered_classes/1"
        );
        setOffered(res1.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, [update]);

  console.log(subClass);
  console.log(offered);
  const offeredID = offered.map((item) => item.sub_class_id);
  const subClassID = subClass.map((item) => item.sub_class_id);
  console.log(subClassID);
  console.log(offeredID);

  const HandleCheck = (id) => {
    if (offeredID.includes(id)) {
      //remove item from offered list
      const ArrRemovedItem = offered.filter((item) => {
        return item.sub_class_id !== id;
      });
      setOffered(ArrRemovedItem);
    } else {
      //add item to offered list
      const classIndex = subClass.findIndex((item) => item.sub_class_id === id);
      const ArrAddedItem = [...offered, subClass[classIndex]];

      setOffered(ArrAddedItem);
    }
  };

  const CreateList = () => {
    const offeredID = offered.map((item) => item.sub_class_id);

    return subClass.map((item) => {
      return (
        <div>
          <label>{item.name}: </label>
          <input
            type='checkbox'
            value={item.sub_class_id}
            checked={offeredID.includes(item.sub_class_id)}
            onChange={() => HandleCheck(item.sub_class_id)}
          />
        </div>
      );
    });
  };

  return <div>{CreateList()}</div>;
}
