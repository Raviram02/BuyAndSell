import { Modal, Form, Input, message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../redux/loadersSlice";
import { PlaceNewBid } from "../../apicalls/products";
import { AddNotification } from "../../apicalls/notifications";

function BidModal({ showBidModal, setShowBidModal, product, reloadData }) {
  const { user } = useSelector((state) => state.users);
  const formRef = React.useRef();
  const rules = [{ required: true, message: "Required" }];
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      const response = await PlaceNewBid({
        ...values,
        amount: values.bidAmount,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      dispatch(setLoader(false));
      if (response.success) {
        message.success("Bid added successfully");

        // send notification to seller
        await AddNotification({
          user: product.seller._id,
          title: "New bid placed",
          message: `A new  bid has been placed on your product ${product.name} by ${user.name} for ₹ ${values.bidAmount}`,
          onClick: "/profile",
          read: false,
        });

        reloadData();
        setShowBidModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoader(false));
    }
  };
  return (
    <Modal
      open={showBidModal}
      onCancel={() => setShowBidModal(false)}
      centered
      width={600}
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <div className="flex flex-col gap-5 mb-5">
        <h1 className="text-2xl font-semibold text-red-800 text-center">
          New Bid
        </h1>

        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="Message" name="message" rules={rules}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="Mobile No." name="mobile" rules={rules}>
            <Input type="number"></Input>
          </Form.Item>
          <Form.Item label="Hostel No." name="hostel" rules={rules}>
            <Input type="number"></Input>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default BidModal;
