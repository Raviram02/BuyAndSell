import React from "react";
import { useEffect } from "react";
import { Avatar, Badge, message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../redux/loadersSlice";
import { useSelector } from "react-redux";
import { setUser } from "../redux/usersSlice";
import { useState } from "react";
import Notifications from "./Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";

function ProtectedPage({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateToken = async () => {
  try {
    dispatch(setLoader(true));
    const response = await GetCurrentUser();
    dispatch(setLoader(false));

    if (response.success) {
      dispatch(setUser(response.data));
    } else {
      message.error(response.message); 
      navigate("/login");
    }
  } catch (error) {
    dispatch(setLoader(false));
    message.error(error.message);
    navigate("/login");
  }
};




  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    user && (
      <div>
        {/* header */}
        <div className="flex justify-between items-center bg-blue-500 p-5">
          <h1
            className="text-2xl text-white font-semibold cursor-pointer responsive-title"
            onClick={() => {
              const randomKey = Date.now(); // Unique key for every click
              navigate(`/?refresh=${randomKey}`);
            }}
          >
            BuyAndSell
          </h1>

          <div className="bg-white px-2 py-2 rounded flex gap-2 items-center resposive-div">
            <i
              className="ri-user-fill cursor-pointer"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            ></i>
            <span
              className="underline cursor-pointer uppercase hidden md:inline"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>

            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i className="ri-notification-line"></i>}
              />
            </Badge>

            <i
              className="ri-logout-box-r-line ml-10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* body */}
        <div className="p-5">{children}</div>

        {
          <Notifications
            notifications={notifications}
            relaodNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
}

export default ProtectedPage;
