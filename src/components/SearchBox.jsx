import React from "react";

export default function SearchBox({ label, placeholder, value, handleSearch }) {
  return (
    <div className="flex items-center gap-3 pl-0 lg:pl-8 flex-1 font-primary">
      <label className="text-lg font-semibold text-primary dark:text-light">
        {label}
      </label>
      <input
        type="search"
        className="px-5 py-2.5 text-base xl:shadow-depth-m xl:dark:shadow-depth-l rounded-3xl transition ease-in duration-100 backdrop-blur-lg backdrop-brightness-125 dark:backdrop-brightness-75 shadow-sm focus:shadow-l dark:focus:shadow-l dark:focus:shadow-gray-700 focus:outline-none text-gray-800 dark:text-lighter"
        placeholder={placeholder}
        value={value}
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  );
}
