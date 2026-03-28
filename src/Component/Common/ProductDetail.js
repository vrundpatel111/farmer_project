import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/ProductDetail.css";
import { useParams } from "react-router-dom";

const ProductDetail = () => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState({
    sold: 0,
    purchased: 0
  });

  const businessman = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    // get product detail
    axios.get(`http://localhost:8080/products/${id}`)
      .then(res => {
        setProduct(res.data);
      });

    // get product statistics (you need backend api)
    axios.get(`http://localhost:8080/products/stats/${id}`)
      .then(res => {
        setStats(res.data);
      })
      .catch(() => {
        console.log("Stats API not available");
      });

  }, [id]);


  const requestMeeting = async () => {

    const meeting = {
      farmerId: product.farmerId,
      businessmanId: businessman.id,
      productId: product.id,
      meetingDate: "2026-03-10",
      meetingTime: "10:00 AM"
    };

    try {

      await axios.post("http://localhost:8080/meeting/request", meeting);
      alert("Meeting Request Sent");

    } catch (error) {

      alert("Failed to send meeting request");

    }

  };


  // Download report
  const downloadReport = () => {

    const data = `
Product Name,${product.productName}
Price,${product.price}
Quantity,${product.quantity}
Category,${product.category}
Location,${product.location}
Sold Quantity,${stats.sold}
Purchased Quantity,${stats.purchased}
Farmer ID,${product.farmerId}
`;

    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${product.productName}_report.csv`;
    link.click();

  };


  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (

    <div className="product-detail-container">

      <div className="product-card">

        <div className="product-image">
          <img
            src="https://via.placeholder.com/300"
            alt="product"
          />
        </div>

        <div className="product-info">

          <h2>{product.productName}</h2>

          <h3>₹ {product.price} / kg</h3>

          <p><b>Quantity :</b> {product.quantity} kg</p>
          <p><b>Category :</b> {product.category}</p>
          <p><b>Location :</b> {product.location}</p>
          <p><b>Description :</b> {product.description}</p>

          <div className="farmer-info">
            <h4>Farmer Details</h4>
            <p>Farmer ID : {product.farmerId}</p>
          </div>

          <div className="sales-info">
            <h4>Sales Information</h4>
            <p><b>Total Sold :</b> {stats.sold} kg</p>
            <p><b>Total Purchased :</b> {stats.purchased} kg</p>
          </div>

          <div className="button-group">

            <button
              className="meeting-btn"
              onClick={requestMeeting}
            >
              Request Meeting
            </button>

            <button
              className="download-btn"
              onClick={downloadReport}
            >
              Download Report
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProductDetail;