import React from "react";
import SearchBar from "../components/SearchBar";

const SearchPage = () => {
  return (
    <section className="page-section">
      <div className="hero">
        <div className="hero-badge-row">
          <span className="hero-badge-pill">AI‑Powered Search Engine</span>
        </div>
        <h1 className="hero-title">
          Search <span className="hero-highlight">Redefined.</span>
        </h1>
        <p className="hero-subtitle">
          Experience intelligent product discovery with fuzzy search, real‑time
          refinement, and semantic understanding.
        </p>
        <div className="hero-search-wrapper">
          <SearchBar />
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3 className="feature-title">Fuzzy Logic Indexing</h3>
          <p className="feature-copy">
            Implemented via Fuse.js to handle bitwise typos and approximate
            string matches without extra database overhead.
          </p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Query Normalization</h3>
          <p className="feature-copy">
            Micro‑service layer refines user intent and handles colloquial
            search patterns dynamically.
          </p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">Performance Architecture</h3>
          <p className="feature-copy">
            Optimized for sub‑50ms responses through debounced state and smart
            client caching.
          </p>
        </article>
      </div>
    </section>
  );
};

export default SearchPage;

