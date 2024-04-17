import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OTPVerification from "./components/OTPVerification";
import Home from "./components/Home";
import GPT from "./components/GPT";
import Langchain from "./components/Langchain";
import PDFDataDisplay from "./components/PDFDataDisplay"
const router = createBrowserRouter([
  
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "signup",
    element: <Signup/>,
  },
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "OTPVerification",
    element: <OTPVerification/>,
  },
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "GPT",
    element: <GPT/>,
  },
  {
    path: "Langchain",
    element: <Langchain/>,
  },
  {
    path: "PDFDataDisplay",
    element: <PDFDataDisplay/>,
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);









