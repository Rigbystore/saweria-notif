// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Roblox
const ROBLOX_API_KEY = "YOUR_ROBLOX_OPEN_CLOUD_API_KEY";
const UNIVERSE_ID = "YOUR_UNIVERSE_ID";
const TOPIC_NAME = "SaweriaDonation";

// Endpoint untuk menerima webhook Saweria
app.post('/saweria-webhook', async (req, res) => {
    try {
        console.log('📩 Webhook received:', JSON.stringify(req.body, null, 2));
        
        const donation = req.body;
        
        // Format data untuk Roblox
        const notifData = {
            donor_name: donation.donator_name || donation.donor_name || "Anonymous",
            amount: parseInt(donation.amount) || 0,
            message: donation.message || donation.comment || "",
            timestamp: Date.now(),
            donation_id: donation.id || ""
        };
        
        console.log('📤 Sending to Roblox:', notifData);
        
        // Kirim ke Roblox MessagingService
        const response = await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${TOPIC_NAME}`,
            {
                message: JSON.stringify(notifData)
            },
            {
                headers: {
                    'x-api-key': ROBLOX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Successfully sent to Roblox!');
        res.status(200).json({ success: true, message: 'Donation processed' });
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Saweria to Roblox Bridge is running! 🚀');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/saweria-webhook`);
});
