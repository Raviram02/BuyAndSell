import React, { useEffect, useState } from "react";
import { Modal, Tabs, Form, Input, Row, Col, message, Checkbox } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loadersSlice";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import Images from "./Images";

const additionalThings = [
  {
    label: "Bill Available",
    name: "billAvailable",
  },
  {
    label: "Warranty Available",
    name: "warrantyAvailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label: "Box Available",
    name: "boxAvailable",
  },
];

const rules = [
  {
    required: true,
    message: "Required",
  },
];

function ProductsForm({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) {
  const [selectedTab = "1", setSelectedTab] = useState("1");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values);
      }
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
        setShowProductForm(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      // message.error(error.message);
    }
  };

  const formRef = React.useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width="90vw"
      style={{ maxWidth: 1000 }}
      okText="Save"
      onOk={() => {
        formRef.current.submit();
      }}
      {...(selectedTab === "2" && { footer: false })}
      bodyStyle={{
        maxHeight: "75vh",
        overflowY: "auto",
        padding: "16px",
      }}
    >
      <div className="w-full">
        <h1 className="text-gray-500 text-xl text-center font-semibold uppercase mb-6">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>

        <Tabs activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
          <Tabs.TabPane tab="General" key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
              <Form.Item label="Name" name="name" rules={rules}>
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={rules}>
                <TextArea rows={3} />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Price" name="price" rules={rules}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select className="w-full border border-gray-300 rounded px-2 h-10">
                      <option value="">Select</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashionAndWearables">
                        Fashion & Wearables
                      </option>
                      <option value="sports">Sports</option>
                      <option value="cycles">Cycles</option>
                      <option value="booksAndStationery">
                        Books & Stationery
                      </option>
                      <option value="roomEssentials">Room Essentials</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product Age (in years)
"
                    name="age"
                    rules={rules}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Hostel No." name="hostel" rules={rules}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mt-4">
                <h2 className="text-md font-semibold mb-2">
                  Additional Options
                </h2>
                <Row gutter={[16, 16]}>
                  {additionalThings.map((item) => (
                    <Col xs={24} sm={12} md={6} key={item.name}>
                      <Form.Item
                        name={item.name}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox className="text-sm">{item.label}</Checkbox>
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="mt-6 p-4 border rounded-md bg-gray-50">
                <Form.Item
                  name="showBidsOnProductPage"
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox className="text-base font-semibold text-blue-700">
                    Show bids on Product Page
                  </Checkbox>
                </Form.Item>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
            <Images
              selectedProduct={selectedProduct}
              getData={getData}
              setShowProductForm={setShowProductForm}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
}

export default ProductsForm;
