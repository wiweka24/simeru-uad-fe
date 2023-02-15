import React from "react";
import CheckboxHelper from "../components/CourseHelp/CheckboxesHelper";

export default function CourseHelp() {
  return (
    <div className="relative">
      <div className="h-10 border-b bg-white"></div>
      <div className="border-2 rounded-lg bg-white m-10 gap-5">
        <CheckboxHelper />
      </div>
    </div>
  );
}
