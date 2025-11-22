const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

const SAWERIA_USER = process.env.SAWERIA_USERNAME;
const ROBLOX_URL = process.env.ROBLOX_WEBHOOK_URL;
const INTERVAL = parseInt(process.env.POLLING_INTERVAL) || 30000;

if (!SAWERIA_USER || !ROBLOX_URL) {
  console.error("❌ Isi SAWERIA_USERNAME & ROBLOX_WEBHOOK_URL di Railway!");
  process.exit(1);
}

let lastId = null;

async function checkDonation() {
  try {
    const res = await axios.get(`https://saweria.co/${SAWERIA_USER}`);
    const $ = cheerio.load(res.data);
    const first = $('.donation-item').first();
    
    if (!first.length) return;
    
    const name = first.find('.donation-name').text().trim() || "Anonim";
    const amount = parseInt(first.find('.donation-amount').text().replace(/\D/g, '')) || 0;
    const msg = first.find('.donation-message').text().trim() || "";
    const id = `${name}-${amount}`;
    
    if (id !== lastId) {
      lastId = id;
      await axios.post(ROBLOX_URL, { name, amount, message: msg });
      console.log(`✅ Kirim: ${name} - Rp${amount}`);
    }
  } catch (e) {
    console.error("⚠️ Error:", e.message);
  }
}

setInterval(checkDonation, INTERVAL);
app.get('/health', (req, res) => res.send('OK'));

app.listen(process.env.PORT || 3000, () => console.log('🟢 Jalan!'));

