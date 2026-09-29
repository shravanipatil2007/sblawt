import React, { useState } from 'react';
import axios from 'axios';
import './Account.css';

export default function Account() {
  const [email, setEmail] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/${email}`);
      setCustomerData(res.data.customer);
    } catch (err) {
      setError('No active connection found with this email address.');
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>My FiberNet Account</h2>
        <p>Enter your registered email to view your broadband status, plan details, and billing history.</p>
        
        <form onSubmit={handleLookup} className="lookup-form">
          <input 
            type="email" 
            placeholder="Enter registered email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'View Account'}
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        {customerData && (
          <div className="dashboard-results">
            <div className="status-badge-container">
              <span>Connection Status: </span>
              <span className={`status-pill ${customerData.status.toLowerCase()}`}>
                {customerData.status}
              </span>
            </div>
            
            <div className="info-group">
              <p><strong>Customer Name:</strong> {customerData.name}</p>
              <p><strong>Phone Number:</strong> {customerData.phone}</p>
              <p><strong>Active Plan Amount:</strong> ₹{customerData.amount} / month</p>
              <p><strong>Razorpay Payment ID:</strong> <code>{customerData.paymentId || 'Pending/Unpaid'}</code></p>
            </div>

            <div className="usage-section">
              <h4>Current Month Data Usage</h4>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '42%' }}></div>
              </div>
              <p className="usage-text">450 GB used of Unlimited (3300 GB FUP Limit)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}