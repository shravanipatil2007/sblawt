import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', plan: '499', amount: '499' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'plan') {
      let amt = '499';
      if (value === '799') amt = '799';
      if (value === '1499') amt = '1499';
      setFormData({ ...formData, plan: value, amount: amt });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRegisterAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save user credentials to MongoDB
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // 2. Load Razorpay and create order
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load.');
        setLoading(false);
        return;
      }

      const orderResponse = await axios.post('http://localhost:5000/api/create-order', formData);
      const data = orderResponse.data;

      const options = {
        key: "rzp_test_ThzTrerR9cBhuc", // Use your Razorpay test key ID
        amount: data.amount,
        currency: data.currency,
        name: "FiberNet ISP",
        description: `Broadband Connection - Plan ₹${formData.amount}`,
        order_id: data.orderId,
        handler: async function (response) {
          await axios.post('http://localhost:5000/api/verify-payment', {
            email: formData.email,
            paymentId: response.razorpay_payment_id || "pay_dummy_" + Date.now()
          });
          alert(`🎉 Registration & Payment Successful! Welcome, ${formData.name}.`);
          navigate('/account');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#38bdf8" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed or email already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create ISP Account</h2>
        <form onSubmit={handleRegisterAndPay}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="********" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div className="form-group">
            <label>Select Broadband Plan</label>
            <select name="plan" value={formData.plan} onChange={handleChange}>
              <option value="499">Starter Plan - ₹499/mo (40 Mbps)</option>
              <option value="799">Pro Speed - ₹799/mo (150 Mbps)</option>
              <option value="1499">Ultra Gigabit - ₹1499/mo (500 Mbps)</option>
            </select>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${formData.amount} & Register`}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}