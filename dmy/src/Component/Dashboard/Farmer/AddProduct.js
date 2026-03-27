import { useState, useEffect } from "react";
import axios from "axios";
import "../../../Style/AddProduct.css";
import { useNavigate } from "react-router-dom";

export const AddProduct = () => {

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [product, setProduct] = useState({
    productName: "",
    quantity: "",
    price: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // edit mode
  const [editId, setEditId] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/products/user/${userId}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [userId]);

  // INPUT CHANGE
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if (editId) {

        // UPDATE PRODUCT
        await axios.put(
          `http://localhost:8080/products/${editId}`,
          {
            productName: product.productName,
            quantity: Number(product.quantity),
            price: Number(product.price),
          }
        );

        alert("Product Updated Successfully ✅");
        setEditId(null);

      } else {

        // ADD PRODUCT
        await axios.post(
          `http://localhost:8080/products/add/${userId}`,
          {
            productName: product.productName,
            quantity: Number(product.quantity),
            price: Number(product.price),
          }
        );

        alert("Product Added Successfully ✅");
      }

      setProduct({
        productName: "",
        quantity: "",
        price: "",
      });

      fetchProducts();

    } catch (error) {
      console.error("Operation error:", error);
      alert("Failed operation ❌");
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (productId) => {

    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8080/products/${productId}`
      );

      fetchProducts();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // EDIT PRODUCT
  const handleEdit = (p) => {

    setProduct({
      productName: p.productName,
      quantity: p.quantity,
      price: p.price,
    });

    setEditId(p.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SOLD PRODUCT (Navigate to Detail)
  const handleSold = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="add-product-container">

      <div className="add-product-card">

        <h1 className="title">
          {editId ? "✏ Update Product" : "🌾 Add New Product"}
        </h1>

        <form className="add-product-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Quantity (Kg)</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : editId
                ? "✔ Update Product"
                : "➕ Add Product"}
          </button>

        </form>

        {/* PRODUCT TABLE */}

        <div className="product-list">
          <h2>Your Products</h2>
          {products.filter((p) => p.status !== "SOLD").length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity (Kg)</th>
                  <th>Price (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.status !== "SOLD")
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.productName}</td>
                      <td>{p.quantity}</td>
                      <td>₹{p.price}</td>
                      <td className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(p)}>✏ Edit</button>
                        <button className="sold-btn" onClick={() => handleSold(p.id)}>💰 Sold</button>
                        <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="submit-btn" onClick={() => navigate("/farmer-dashboard")}>
                  ⬅ Back to Dashboard
                </button>
              </div>

            </table>
          )}
        </div>

      </div>

    </div>
  );
};

export default AddProduct;