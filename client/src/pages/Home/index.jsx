import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Input } from "antd";
import { GetProducts } from "../../apicalls/products";
import { setLoader } from "../../redux/loadersSlice";
import Divider from "../../components/Divider";
import Filters from "./Filters";

const { Search } = Input;

function Home() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
  });

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProducts(filters);
      dispatch(setLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProducts({ ...filters, search });
      dispatch(setLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refresh = params.get("refresh");

    if (refresh) {
      // Clear search and filters
      setSearch("");
      setFilters({
        status: "approved",
        category: [],
      });
      getData(); // Fetch all products
    }
  }, [location.search]);

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Search + Filter Icon Row */}
      <div className="flex items-center gap-1 w-full">
        {/* Filter Icon */}
        {!showFilters && (
          <i
            className="ri-equalizer-fill text-2xl cursor-pointer"
            onClick={() => setShowFilters(true)}
          ></i>
        )}

        {/* Search Box */}
        <div className="flex items-center gap-2 flex-grow px-3 py-2 borde">
          <input
            type="text"
            placeholder="Search products here..."
            className="flex-grow outline-none rounded-md px-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchProducts();
            }}
          />

          {/* Clear (X) Button */}
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                getData(); // this will fetch all products
              }}
              className="text-gray-400 hover:text-black"
              title="Clear"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          )}

          {/* Search Icon Button */}
          <button
            type="button"
            onClick={fetchProducts}
            className="text-gray-600 hover:text-black"
            title="Search"
          >
            <i className="ri-search-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Filters */}
        {showFilters && (
          <div className="w-full lg:w-72">
            <Filters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products?.map((product) => (
            <div
              className="border border-gray-300 rounded flex flex-col gap-3 pb-2 cursor-pointer hover:shadow-md transition"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                className="w-full h-64 p-2 rounded-md object-cover"
                src={product.images[0]}
                alt="product"
              />

              <div className="px-2 flex flex-col">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm text-gray-600">
                  {product.age} {product.age === 1 ? "year" : "years"} old
                </p>
                <Divider />
                <span className="text-xl font-semibold text-green-700">
                  ₹{product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
