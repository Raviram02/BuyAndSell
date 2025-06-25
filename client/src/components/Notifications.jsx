import { message, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DeleteNotification } from "../apicalls/notifications";
import { setLoader } from "../redux/loadersSlice";
import { useDispatch } from "react-redux";

function Notifications({
  notifications = [],
  relaodNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteNotification = async (id) => {
    try {
      dispatch(setLoader(true));
      const response = await DeleteNotification(id);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        relaodNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };

  return (
    <Modal
    
      title="NOTIFICATIONS"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centerd
      width={1000}
      
    >
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            className="flex flex-col  border border-solid p-2 border-gray-300 rounded cursor-pointer"
            key={notification._id}
          >
            <div className="flex justify-between items-center">
              <div
                onClick={() => {
                  navigate(notification.onClick);
                  setShowNotifications(false);
                }}
              >
                <h1 className="font-semibold text-gray-600">
                  {" "}
                  {notification.title}
                </h1>
                <span className="text-gray-500 font-medium">{notification.message}</span>
                <h1 className="text-gray-500 text-sm">
                  {moment(notification.createdAt).fromNow()}
                </h1>
              </div>
              <i
                className="ri-delete-bin-line"
                onClick={() => {
                  deleteNotification(notification._id);
                }}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Notifications;
