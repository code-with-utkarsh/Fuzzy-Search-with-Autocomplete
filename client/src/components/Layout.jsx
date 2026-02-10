import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const hasLoadedProducts = useRef(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProducts(false);
      }
    }
    if (showProducts) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProducts]);

  const handleOpenProducts = async () => {
    setShowProducts((prev) => !prev);

    if (hasLoadedProducts.current || products.length > 0) {
      return;
    }

    try {
      setLoadingProducts(true);
      setProductsError("");
      const res = await axios.get("/api/search/all");
      setProducts(res.data || []);
      hasLoadedProducts.current = true;
    } catch (err) {
      console.error(err);
      setProductsError("Unable to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleNavigateToProduct = (slug) => {
    setShowProducts(false);
    navigate(`/item/${slug}`);
  };

  const getCategoryAccent = (category) => {
    if (!category) return "";
    const lower = category.toLowerCase();
    if (lower.includes("electro")) return "Hero pick";
    if (lower.includes("home")) return "Home highlight";
    if (lower.includes("travel")) return "Travel essential";
    if (lower.includes("fitness")) return "Wellness";
    return category;
  };

  return (
    <div className="app-root">
      <div className="orb orb-top" />
      <div className="orb orb-bottom" />

      <div className="app-shell">
        <header className="top-nav" ref={dropdownRef}>
          <div className="top-nav-left">
            <div className="logo-badge">
              <span className="logo-dot" />
              <span className="logo-text">FuzzyFinder</span>
            </div>
          </div>
          <div className="top-nav-center">
            <button className="nav-pill" type="button" onClick={handleOpenProducts}>
              <span>All Products</span>
              <span className="nav-pill-caret">▾</span>
            </button>
          </div>
          <div className="top-nav-right">
            <div className="nav-pill nav-pill-soft" aria-hidden="true">
              <span className="nav-pill-dot" />
              <span>Realtime Fuzzy Search</span>
            </div>
          </div>
        </header>

        {showProducts && (
          <div className="products-dropdown">
            <div className="products-dropdown-inner">
              <div className="products-dropdown-header">
                <span className="products-title">All products</span>
                <span className="products-count">
                  {products.length ? `${products.length} items` : ""}
                </span>
              </div>
              {loadingProducts && (
                <div className="products-status">Loading products…</div>
              )}
              {productsError && !loadingProducts && (
                <div className="products-status products-status-error">
                  {productsError}
                </div>
              )}
              {!loadingProducts && !productsError && products.length > 0 && (
                <ul className="products-list">
                  {products.map((item) => (
                    <li
                      key={item.id}
                      className="products-list-item"
                      onClick={() => handleNavigateToProduct(item.slug)}
                    >
                      {item.imageUrl && (
                        <div className="products-list-thumb">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                      )}
                      <div className="products-list-body">
                        <div className="products-list-main">
                          <span className="products-list-name">
                            {item.name}
                          </span>
                          {item.category && (
                            <span className="products-list-category">
                              {getCategoryAccent(item.category)}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="products-list-description">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <main className="app-main">
          <div className="page-container">{children}</div>
        </main>

        <footer className="site-footer">
          <div className="site-footer-left">
            <span className="site-footer-logo">FF</span>
            <span className="site-footer-text">
              © {new Date().getFullYear()} FuzzyFinder. All rights reserved.
            </span>
          </div>
          <div className="site-footer-right">
            <span>React</span>
            <span>Node &amp; Express</span>
            <span>MongoDB</span>
            <span>Fuse.js</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

