import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/search/item/${slug}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setError("We couldn't find that item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [slug]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="detail-card detail-card-muted">Loading item…</div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="page-section">
        <div className="detail-card detail-card-muted">
          <p>{error || "Item not found."}</p>
          <button className="ghost-button" onClick={() => navigate("/")}>
            Back to search
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="detail-card">
        <div className="detail-layout">
          {item.imageUrl && (
            <div className="detail-image-wrapper">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="detail-image"
              />
            </div>
          )}
          <div className="detail-content">
            <button className="pill-button" onClick={() => navigate("/")}>
              ← Back to search
            </button>
            <h1 className="detail-title">{item.name}</h1>
            {item.category && (
              <div className="detail-category">{item.category}</div>
            )}
            {item.description && (
              <p className="detail-description">{item.description}</p>
            )}
            <div className="detail-meta">
              <span>Slug: {item.slug}</span>
              <span>MongoDB document id: {item.id}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemDetailPage;

