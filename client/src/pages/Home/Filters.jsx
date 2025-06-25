import React from "react";

const categories = [
  {
    name: "Electronics",
    value: "electronics",
  },
  {
    name: "Fashion & Wearables",
    value: "fashionAndWearables",
  },
  {
    name: "Sports",
    value: "sports",
  },
  {
    name: "Cycles",
    value: "cycles",
  },
  {
    name: "Books & Stationery",
    value: "booksAndStationery",
  },
  {
    name: "Room Essentials",
    value: "roomEssentials",
  },
];

function Filters({ showFilters, setShowFilters, filters, setFilters }) {
  return (
    <div className="w-72 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-red-800 font-semibold text-xl">Filters</h1>
        <i
          className="ri-close-line text-xl cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        ></i>
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <h1 className="text-gray-600 text-lg font-semibold">Categories</h1>

        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            return (
              <div className="flex items-center gap-2" key={category.value}>
                <input
                  type="checkbox"
                  name="category"
                  className="max-width"
                  checked={filters.category.includes(category.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        category: [...filters.category, category.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        category: filters.category.filter(
                          (item) => item !== category.value
                        ),
                      });
                    }
                  }}
                />
                <label htmlFor="category">{category.name}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Filters;
