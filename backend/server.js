const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect MongoDB (using local or Atlas URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/isp-portal';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 2. Define Customer Schema & Model
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  plan: String,
  amount: Number,
  paymentId: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 4. API Route to Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, name, email, phone, plan } = req.body;

    const options = {
      amount: Number(amount) * 100, // paise
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    // Save initial registration to MongoDB as Pending
    const newCustomer = new Customer({ name, email, phone, plan, amount, status: 'Pending' });
    await newCustomer.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
});

// API Route to fetch customer account details by email
app.get('/api/customer/:email', async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching account" });
  }
});

// 5. API Route to Verify/Complete Payment Status
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { email, paymentId } = req.body;
    await Customer.findOneAndUpdate({ email }, { paymentId, status: 'Paid' });
    res.json({ success: true, message: "Payment recorded and registration confirmed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating payment" });
  }
});

// 1. Add User Schema & Model for Authentication
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 2. User Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered!" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.json({ success: true, message: "Registration successful! You can now log in." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// 3. User Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password!" });
    }

    res.json({ success: true, message: "Login successful!", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});