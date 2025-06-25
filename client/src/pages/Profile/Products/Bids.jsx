import { Modal, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import { setLoader } from "../../../redux/loadersSlice";
import moment from "moment";
import Divider from "../../../components/Divider";

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetAllBids({
        product: selectedProduct._id,
      });
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
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return record.buyer.name;
      },
    },
    {
      title: "Bid Placed On",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm a"),
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile}</p>
            <p>Email: {record.buyer.email}</p>
            <p>Hostel: H - {record.hostel}</p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width="90%"
      footer={null}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-red-800 text-lg md:text-xl font-bold">Bids</h1>
        <Divider />
        <h1 className=" text-base md:text-lg font-semibold">
          Product Name : <span className="text-gray-500 text-base md:text-lg font-semibold">{selectedProduct.name}</span>
        </h1>

        <div className="overflow-x-auto w-full">
          <Table
            columns={columns}
            dataSource={bidsData}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }} // horizontal scroll for table
          />
        </div>
      </div>
    </Modal>
  );
}

export default Bids;
