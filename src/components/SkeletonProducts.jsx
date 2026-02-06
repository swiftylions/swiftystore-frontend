import React from "react";

export default function SkeletonProducts() {
  return (
    <>
      {/* Section بالا */}
      <div className="container mt-20 mx-auto animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-500 border-gray-300 dark:border-gray-600 rounded-md max-w-md leading-6 mx-auto mt-4 px-6 py-4"></div>
        <div className="bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-600 rounded-md max-w-[576px] leading-6 mx-auto mt-2 px-6 py-6"></div>
      </div>

      {/* فیلتر یا کنترل‌ها */}
      <div className="max-w-[1050px] mx-auto animate-pulse mt-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12">
          <div className="flex items-center gap-3 max-w-3xs w-3xs pl-4 justify-end px-3 py-5 rounded-full pr-12 flex-1 bg-gray-200 dark:bg-gray-500 border-gray-300 dark:border-gray-600"></div>
          <div className="flex items-center gap-4 max-w-3xs w-3xs pl-4 flex-1 px-4 py-5 rounded-full bg-gray-200 dark:bg-gray-500 border-gray-300 dark:border-gray-600"></div>
        </div>
      </div>

      {/* کارت‌ها */}
      <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div
            key={index}
            className="w-72 rounded-md mx-auto border bg-white dark:bg-darkbg border-gray-300 dark:border-gray-600 overflow-hidden flex flex-col animate-pulse"
          >
            {/* تصویر کارت */}
            <div className="relative w-full h-72 border-b border-gray-300 bg-gray-200 overflow-hidden rounded-md">
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>

            {/* بدنه کارت */}
            <div className="relative h-48 p-4 flex flex-col font-primary">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="flex items-center justify-between mt-auto">
                <div className="h-6 w-16 bg-gray-200 rounded-tl-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
