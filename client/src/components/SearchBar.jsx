import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getCategoryAccent = (category) => {
  if (!category) return "";
  const lower = category.toLowerCase();
  if (lower.includes("electro")) return "Electronics · Trending";
  if (lower.includes("home")) return "Home · Curated pick";
  if (lower.includes("travel")) return "Travel · Ready to go";
  if (lower.includes("fitness")) return "Fitness · Daily essential";
  return category;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setError("");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/search", {
          params: { q: query.trim() },
        });
        setResults(res.data || []);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while searching.");
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/item/${item.slug}`);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? results.length - 1 : (prev - 1) % results.length
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <label className="search-label" htmlFor="search">
        What are you looking for?
      </label>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          id="search"
          type="text"
          className="search-input"
          placeholder="Try typing “headphones”, “keyboard”, or “candle”..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && <div className="search-spinner" />}
        {!loading && query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
          >
            ×
          </button>
        )}
      </div>
      {error && <div className="search-error">{error}</div>}
      {isOpen && results.length > 0 && (
        <ul className="search-dropdown" role="listbox">
          {results.map((item, idx) => (
            <li
              key={item.id}
              className={
                "search-option" + (idx === activeIndex ? " is-active" : "")
              }
              onMouseDown={(e) => {
                // Prevent input blur before click
                e.preventDefault();
                handleSelect(item);
              }}
              role="option"
              aria-selected={idx === activeIndex}
            >
              {item.imageUrl && (
                <div className="search-option-thumb">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
              )}
              <div className="search-option-body">
                <div className="search-option-main">
                  <span className="search-option-name">{item.name}</span>
                  {item.category && (
                    <span className="search-option-category">
                      {getCategoryAccent(item.category)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <div className="search-option-description">
                    {item.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && results.length === 0 && query && !error && (
        <div className="search-empty">No matches yet. Try another term.</div>
      )}
    </div>
  );
};

export default SearchBar;

