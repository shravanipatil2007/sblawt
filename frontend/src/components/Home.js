import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [pincode, setPincode] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Pincode Checker Logic (Simulated service check)
  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setAvailabilityMessage({
        success: true,
        text: `🚀 Great news! Ultra-fast FiberNet is available in area code ${pincode}.`
      });
    } else {
      setAvailabilityMessage({
        success: false,
        text: `❌ Please enter a valid 6-digit Indian pincode.`
      });
    }
  };

  // FAQ Toggle Logic
  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    { q: "What is the installation timeline?", a: "Our technician typically installs and activates your connection within 24 to 48 hours of payment." },
    { q: "Do I get a free Wi-Fi router?", a: "Yes! Dual-band high-speed Wi-Fi 6 router is included completely free with all plans." },
    { q: "Can I upgrade my plan later?", a: "Absolutely. You can switch plans anytime directly through your customer dashboard." }
  ];

  return (
    <div className="home-container">
      {/* Hero Section with Glassmorphism Pincode Checker */}
      <header className="hero">
        <div className="hero-content">
          <span className="badge-new">⚡ India’s Fastest Growing ISP</span>
          <h1>Experience Lightning-Fast Fiber Internet</h1>
          <p>Seamless streaming, ultra-low latency gaming, and powerful work-from-home speeds.</p>
          
          {/* Pincode Availability Checker */}
          <form onSubmit={checkPincode} className="pincode-form">
            <input 
              type="text" 
              placeholder="Enter your 6-digit Pincode..." 
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
            />
            <button type="submit">Check Availability</button>
          </form>
          {availabilityMessage && (
            <p className={`pincode-alert ${availabilityMessage.success ? 'success' : 'error'}`}>
              {availabilityMessage.text}
            </p>
          )}
        </div>
      </header>

      {/* Plans Section with Floating Cards & High-Contrast Badges */}
      <section className="plans-section">
        <h2>Choose Your High-Speed Plan</h2>
        <div className="plans-grid">
          <div className="plan-card">
            <h3>Starter Fiber</h3>
            <p className="price">₹499 <span className="duration">/mo</span></p>
            <ul className="features-list">
              <li>✔️ Speed: 40 Mbps</li>
              <li>✔️ Unlimited Data (3300 GB)</li>
              <li>✔️ Free Dual-Band Router</li>
            </ul>
            <Link to="/register" className="plan-btn">Get Started</Link>
          </div>

          <div className="plan-card popular">
            <span className="ribbon">Most Popular</span>
            <h3>Pro Gamer / OTT</h3>
            <p className="price">₹799 <span className="duration">/mo</span></p>
            <ul className="features-list">
              <li>✔️ Speed: 150 Mbps</li>
              <li>✔️ Unlimited Data + OTT Apps</li>
              <li>✔️ Free Static IP Option</li>
            </ul>
            <Link to="/register" className="plan-btn popular-btn">Get Started</Link>
          </div>

          <div className="plan-card">
            <span className="ribbon best-value">Best Value</span>
            <h3>Ultra Gigabit</h3>
            <p className="price">₹1499 <span className="duration">/mo</span></p>
            <ul className="features-list">
              <li>✔️ Speed: 500 Mbps</li>
              <li>✔️ Priority Enterprise Support</li>
              <li>✔️ 4K Streaming Ready</li>
            </ul>
            <Link to="/register" className="plan-btn">Get Started</Link>
          </div>
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" onClick={() => toggleFaq(index)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <span>{activeIndex === index ? '−' : '+'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}