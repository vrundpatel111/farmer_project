import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../Style/AddProduct.css'; // Reusing styles

const BusinessmanProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [product, setProduct] = useState(null);
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSoldProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/products/user/${userId}`);
      setSoldProducts(res.data.filter(p => p.status === "SOLD"));
    } catch (error) {
      console.error("Error fetching sold products:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await axios.get(`http://localhost:8080/products/${id}`);
          setProduct(res.data);
        } else {
          setProduct(null);
        }
        await fetchSoldProducts();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:8080/products/sold/${id}`);
      alert("Product marked as sold successfully! ✅");
      const updatedProduct = { ...product, status: "SOLD" };
      setProduct(updatedProduct);
      fetchSoldProducts();
    } catch (error) {
      console.error("Error marking product as sold:", error);
      alert("Failed to mark product as sold ❌");
    }
  };

  if (loading) return <div className="add-product-container"><p>Loading...</p></div>;

  return (
    <div className="add-product-container">
      <div className="add-product-card">

        {id && product ? (
          <>
            <h1 className="title">📦 Product Details</h1>
            <div className="product-info" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <p><strong>Name:</strong> {product.productName}</p>
              <p><strong>Quantity:</strong> {product.quantity} Units</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Status:</strong> <span style={{ color: product.status === "SOLD" ? "red" : "green", fontWeight: 'bold' }}>{product.status}</span></p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
              {product.status !== "SOLD" && (
                <button className="submit-btn" onClick={handleConfirm} style={{ backgroundColor: '#fbc02d', color: '#333' }}>
                  💰 Confirm Sale
                </button>
              )}
              <button className="submit-btn" onClick={() => navigate("/businessman-add-product")}>
                ⬅ Back to Products
              </button>
            </div>
          </>
        ) : id && !product ? (
          <p>Product not found.</p>
        ) : null}

        {/* SOLD PRODUCTS SECTION */}
        <div className="product-list">
          <h2 className="title" style={{ fontSize: '1.8rem', marginTop: id ? '20px' : '0' }}>💰 Your Sold Products</h2>
          {soldProducts.length === 0 ? (
            <p>No sold products yet.</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity (Units)</th>
                  <th>Price (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {soldProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.productName}</td>
                    <td>{p.quantity}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <button
                        className="edit-btn"
                        style={{ backgroundColor: "#2e7d32" }}
                        onClick={() => navigate(`/businessman-product-detail/${p.id}`)}
                      >
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!id && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="submit-btn" onClick={() => navigate("/business-dashboard")}>
              ⬅ Back to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BusinessmanProductDetail;
