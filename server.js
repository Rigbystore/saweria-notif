const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const SAWERIA_USER = process.env.SAWERIA_USERNAME || 'ShiShiSUPERCLUB';
const INTERVAL = parseInt(process.env.POLLING_INTERVAL) || 30000;

let latestDonation = null;

async function checkDonation() {
    try {
        console.log("🔍 Memeriksa donasi untuk:", SAWERIA_USER);
        const { data } = await axios.get(`https://saweria.co/${SAWERIA_USER}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (DonationBot)' },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        const items = $('.donation-item');

        if (items.length === 0) {
            console.log("ℹ️ Tidak ada donasi ditemukan");
            return;
        }

        const first = items.first();
        const nameEl = first.find('.donation-name');
        const amountEl = first.find('.donation-amount');
        const messageEl = first.find('.donation-message');

        const name = nameEl.length ? nameEl.text().trim() : "Anonim";
        const amountText = amountEl.length ? amountEl.text().trim() : "0";
        const amount = parseInt(amountText.replace(/\D/g, '')) || 0;
        const message = messageEl.length ? messageEl.text().trim() : "";

        const id = `${name}-${amount}`;
        const now = Date.now();

        // Simpan hanya jika benar-benar baru
        if (!latestDonation || latestDonation.id !== id) {
            latestDonation = { id, name, amount, message, timestamp: now };
            console.log(`✅ Donasi baru: ${name} - Rp${amount}`);
        }
    } catch (err) {
        console.error("🚨 Error saat cek donasi:", err.message);
    }
}

// Jalankan cek pertama saat start
checkDonation();
// Lalu ulangi tiap INTERVAL
setInterval(checkDonation, INTERVAL);

// Endpoint: cek status
app.get('/health', (req, res) => {
    res.json({ status: 'OK', lastCheck: latestDonation?.timestamp });
});

// Endpoint: ambil donasi terbaru
app.get('/latest', (req, res) => {
    if (latestDonation) {
        res.json({
            name: latestDonation.name,
            amount: latestDonation.amount,
            message: latestDonation.message,
            timestamp: latestDonation.timestamp
        });
    } else {
        res.status(404).json({ error: "no_donation_yet" });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🟢 Server jalan di port ${PORT}`);
});
