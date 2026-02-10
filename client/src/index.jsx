import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import axios from "axios";

const container = document.getElementById("root");
const root = createRoot(container);
// Use deployed API in production, local proxy in development
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://fuzzy-search-with-autocomplete.onrender.com"
    : "";

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

