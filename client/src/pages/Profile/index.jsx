import React from "react";
import { Tabs } from "antd";
import Products from "./Products";
import UserBids from "./UserBids";
import { useSelector } from "react-redux";
import moment from "moment";

function Profile() {
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 gap-4 p-4 bg-white rounded-md shadow-md">
            <span className="font-semibold flex justify-between">
              Name: <span className="text-gray-500">{user.name}</span>
            </span>
            <span className="font-semibold flex justify-between">
              Email: <span className="text-gray-500">{user.email}</span>
            </span>
            <span className="font-semibold flex justify-between">
              Created On:{" "}
              <span className="text-gray-500">
                {moment(user.createdAt).format("MMMM D, YYYY")}
              </span>
            </span>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
