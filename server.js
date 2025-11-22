// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Konfigurasi
const ROBLOX_API_KEY = "9EEylv6XC02DNeZpz41cwvAj0X0KwBn+3azIn116TM1Vw/q+ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWpsRlJYbHNkalpZUXpBeVJFNWxXbkI2TkRGamQzWkJhakJZTUV0M1FtNHJNMkY2U1c0eE1UWlVUVEZXZHk5eEt5SXNJbTkzYm1WeVNXUWlPaUk0TlRJd016VTJORE01SWl3aVpYaHdJam94TnpZek9EUTJOelV3TENKcFlYUWlPakUzTmpNNE5ETXhOVEFzSW01aVppSTZNVGMyTXpnME16RTFNSDAuaC05V1lRZ2M5ZlF6cWRTUm5aNjVtTmp2aXJzSi0xaTVMV1VkYVY0cE1fcDlRWHhSbFJhbWtwcldPbzJfclBWbXhtZWxQUkN1OHJxTGZoQ3JtR2Q2aWhhVzVCU01PMGJIQmlLRWlvWFhEWEt3LXFGU2pVb3QxM0N2QTlReGo0R29XNkoxNmE0alBxcHdKQ0F2RVZJUnlkX1Vtak5KM1BBQ3FiOVZ4SEstTWtMQzRtNmFJN2pzUXlmbGFyLVdOU3NXeEMyeE9OZlNMQ3NWMDJrdmV6cXZtVFFHTktUV0M2dE8zSUVRX0Y2bVdLRzliRl81dnlPOVFiYlhYZUdISE1kRmtQTHhwM2txZEpxUGtzWTgtM3FkNTVzM0txVWpkaFlzdEpFSmF3a25ObE1qOWd3NlRNWnhpcVlBN3lab2RDc210VDNFbjgyNDB5M1pZRUROYnpsVHFR";
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

