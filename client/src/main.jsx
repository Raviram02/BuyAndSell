import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import {Provider} from "react-redux";
import store from "./redux/store.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#1677FF",
            colorPrimaryHover: "#1677FF",
            borderRadius: "2px",
            boxShadow: "none",
          },
        },
        token: {
          borderRadius: "2px",
          colorPrimaryHover: "#1677FF",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
