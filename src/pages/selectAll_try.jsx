import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Checkbox from "./Checkbox";
import { Catalogues } from "./mock";

const App = () => {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(Catalogues);
  }, [list]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map(li => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  console.log(isCheck);

  const catalog = list.map(({ id, name }) => {

  return (
    <div>
      <input
        type="checkbox"
        name="selectAll"
        id="selectAll"
        handleClick={handleSelectAll}
        isChecked={isCheckAll}
      />
      Select All
      {catalog}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
