import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = {}; // เก็บข้อมูลในหน่วยความจำ (ง่ายสุด)

app.post("/claim", (req, res) => {
    const amount = req.body.amount;

    if (amount <= 0) {
        return res.json({message: "ไม่มีเหรียญให้เคลม"});
    }

    // TODO: เชื่อมต่อ TON blockchain ที่นี่
    console.log("Claim", amount);

    res.json({message: `ระบบได้รับคำขอเคลม ${amount} KUBA แล้ว`});
});

app.listen(3000, () => console.log(`Server started`));
