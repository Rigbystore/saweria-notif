// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Konfigurasi
const ROBLOX_API_KEY = "YOUR_ROBLOX_OPEN_CLOUD_API_KEY";
const UNIVERSE_ID = "8790434428";
const TOPIC_NAME = "Donation";

// Endpoint untuk menerima webhook Saweria
app.post('/saweria-webhook', async (req, res) => {
    try {
        const donation = req.body;
        
        // Validasi webhook (opsional, sesuaikan dengan Saweria)
        // if (req.headers['x-saweria-signature'] !== YOUR_SECRET) {
        //     return res.status(401).send('Unauthorized');
        // }
        
        // Data yang akan dikirim ke Roblox
        const notifData = {
            donor_name: donation.donor_name || "Anonymous",
            amount: donation.amount || 0,
            message: donation.message || "",
            timestamp: Date.now()
        };
        
        // Kirim ke Roblox MessagingService
        await axios.post(
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
        
        console.log('✅ Donation sent to Roblox:', notifData);
        res.status(200).send('OK');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).send('Error processing webhook');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
