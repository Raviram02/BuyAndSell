import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loadersSlice";
import { jwtDecode } from "jwt-decode";

const rules = [
  {
    required: true,
    message: "required",
  },
];

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      const response = await LoginUser(values);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          navigate("/");
        } else {
          localStorage.removeItem("token"); // Clear expired token
        }
      } catch (err) {
        localStorage.removeItem("token"); // Malformed token
      }
    }
  }, []);

  return (
    <div className="h-screen bg-blue-500 flex justify-center items-center form-container">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-center">
          <span className="text-gray-400 text-2xl font-semibold">Login</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Passowrd" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block className="mt-2">
            {" "}
            Login
          </Button>
          <div className="mt-5 text-center">
            <span className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
