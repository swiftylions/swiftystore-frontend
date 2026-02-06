import React from "react";

export default function DropDown({
  label,
  options,
  selectedValue,
  handleSort,
}) {
  return (
    <div className="flex items-center gap-2 pl-4 justify-end pr-6 lg:pr-12 flex-1 font-primary">
      <label className="text-lg font-semibold text-primary dark:text-light">
        {label}
      </label>
      <select
        className="px-5 py-3 text-base rounded-3xl xl:shadow-depth-m transition backdrop-blur-lg backdrop-brightness-125 dark:backdrop-brightness-75 shadow-sm focus:shadow-l dark:focus:shadow-xl dark:focus:shadow-gray-700 focus:outline-none text-gray-900  dark:text-lighter"
        value={selectedValue}
        onChange={(event) => handleSort(event.target.value)}
      >
        {options.map((optionVal, index) => (
          <option key={index} value={optionVal}>
            {optionVal}
          </option>
        ))}
      </select>
    </div>
  );
}
