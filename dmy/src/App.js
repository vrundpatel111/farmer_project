import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Component/Login';
import Registration from './Component/Registration';

import FarmerDashboard from './Component/Dashboard/Farmer/FarmerHomepage';
import BusinessDashboard from './Component/Dashboard/Businessman/BusinessmanHomepage';
import TransporterDashboard from './Component/Dashboard/Transporter/TransporterHomepage';

import AddProduct from './Component/Dashboard/Farmer/AddProduct';
import Profile from './Component/Common/Profile';
import SeeProfile from './Component/Common/SeeProfile';
import ProductDetail from './Component/Dashboard/Farmer/ProductDetail';
import NotificationCenter from './Component/Common/NotificationCenter';
import MyVehicle from './Component/Dashboard/Transporter/MyVehicle';
import AssignedVehicle from './Component/Dashboard/Transporter/AssignedVehicle';
import TrackVehicle from './Component/Dashboard/Transporter/TrackVehicle';
import AddBusinessmanProduct from './Component/Dashboard/Businessman/AddBusinessmanProduct';
import BusinessmanProductDetail from './Component/Dashboard/Businessman/BusinessmanProductDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Farmer Routes */}
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/meeting" element={<NotificationCenter />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/pending-orders" element={<NotificationCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />

        {/* Other Dashboards */}
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/businessman-add-product" element={<AddBusinessmanProduct />} />
        <Route path="/businessman-product-detail/:id" element={<BusinessmanProductDetail />} />
        <Route path="/businessman-product-detail" element={<BusinessmanProductDetail />} />
        <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
        <Route path="/my-vehicle" element={<MyVehicle />} />
        <Route path="/assigned-vehicle" element={<AssignedVehicle />} />
        <Route path="/track-vehicle" element={<TrackVehicle />} />
        <Route path="/profile/:id" element={<SeeProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
