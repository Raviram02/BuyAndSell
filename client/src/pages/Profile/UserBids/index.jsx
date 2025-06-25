import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import { setLoader } from "../../../redux/loadersSlice";
import moment from "moment";

function Bids() {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetAllBids({ buyer: user._id });
      dispatch(setLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      // message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      width: 150,
      render: (text, record) => record.product.name,
    },
    {
      title: "Seller",
      dataIndex: "seller",
      width: 150,
      render: (text, record) => record.seller.name,
    },
    {
      title: "Bid Placed On",
      dataIndex: "createdAt",
      width: 180,
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm a"),
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      width: 120,
    },
    {
      title: "Message",
      dataIndex: "message",
      width: 200,
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      width: 250,
      render: (text, record) => (
        <div>
          <p>Phone: {record.mobile}</p>
          <p>Email: {record.buyer.email}</p>
          <p>Hostel: {record.hostel}</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={bidsData}
        scroll={{ x: 1000 }} // Enables horizontal scroll on small screens
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default Bids;
