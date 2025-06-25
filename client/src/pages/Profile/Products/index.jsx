import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loadersSlice";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import { message } from "antd";
import moment from "moment";
import Bids from "./Bids";

function Products() {
  const [showBids, setShowBids] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProducts({ seller: user._id });
      dispatch(setLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      // message.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch(setLoader(true));
      const response = await DeleteProduct(id);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      // message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      width: 100,
      render: (text, record) => (
        <img
          src={record?.images?.length > 0 ? record.images[0] : ""}
          alt=""
          className="w-20 h-20 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      width: 180,
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 180,
      render: (text, record) => (
        <div className="flex gap-3 items-center">
          <span
            className="underline cursor-pointer"
            onClick={() => {
              setSelectedProduct(record);
              setShowBids(true);
            }}
          >
            Show Bids
          </span>
          <i
            className="ri-pencil-line cursor-pointer"
            onClick={() => {
              setSelectedProduct(record);
              setShowProductForm(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line text-red-600 cursor-pointer"
            onClick={() => deleteProduct(record._id)}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="px-2 sm:px-5">
      <div className="flex justify-end mb-4">
        <Button
          type="default"
          onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="w-full overflow-auto">
        <Table
          columns={columns}
          dataSource={products}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}

      {showBids && (
        <Bids
          showBidsModal={showBids}
          setShowBidsModal={setShowBids}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;
