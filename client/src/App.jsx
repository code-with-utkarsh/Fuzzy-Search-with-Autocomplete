import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import ItemDetailPage from "./pages/ItemDetailPage";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/item/:slug" element={<ItemDetailPage />} />
      </Routes>
    </Layout>
  );
};

export default App;

