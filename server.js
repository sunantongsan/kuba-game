const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { TonClient, WalletContractV4, internal } = require("@ton/ton");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// memory storage
let users = {};

const DAILY_LIMIT = 5;

// TON
const KUBA_TOKEN_WALLET = "EQDCCMpdq2lab20fVNcXTx44TrGfAnNDvWiFWt9wDfDUY5YT"; // your smart contract

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC"
});

// ------------------------------------
// เล่นเกม (ตีไข่)
// ------------------------------------
app.post("/play", (req, res) => {
    const { userId } = req.body;

    if (!users[userId]) {
        users[userId] = {
            score: 0,
            plays: 0,
            lastReset: Date.now()
        };
    }

    let u = users[userId];

    // รีเซ็ตทุก 24 ชม.
    if (Date.now() - u.lastReset >= 24 * 60 * 60 * 1000) {
        u.plays = 0;
        u.lastReset = Date.now();
    }

    if (u.plays >= DAILY_LIMIT) {
        return res.json({ error: "คุณตีครบ 5 ครั้งแล้ว" });
    }

    u.plays++;

    const reward = Math.floor(Math.random() * 901) + 100;
    u.score += reward;

    res.json({
        reward,
        totalScore: u.score,
        playsLeft: DAILY_LIMIT - u.plays
    });
});

// ------------------------------------
// เคลมเหรียญ KUBA
// ------------------------------------
app.post("/claim", async (req, res) => {
    const { userId, wallet } = req.body;

    if (!users[userId] || users[userId].score <= 0) {
        return res.json({ success: false, error: "ไม่มีคะแนนที่เคลมได้" });
    }

    const amount = users[userId].score;
    users[userId].score = 0;

    try {
        res.json({
            success: true,
            amount,
            wallet,
            message: "ส่ง TON fee เพื่อรับเหรียญ KUBA"
        });
    } catch (err) {
        res.json({ success: false, error: err.toString() });
    }
});

app.listen(3000, () => console.log("Server started on port 3000"));
