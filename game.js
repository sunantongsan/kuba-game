const userId = "user_" + Math.floor(Math.random() * 99999999);

let walletAddress = null;

const ton = new TON_CONNECT.TonConnect();

document.getElementById("connectWallet").onclick = async () => {
    const wallet = await ton.connectWallet();
    walletAddress = wallet.account.address;
    document.getElementById("wallet").innerHTML = "Wallet: " + walletAddress;
};

document.getElementById("playBtn").onclick = async () => {
    const res = await fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (data.error) return alert(data.error);

    document.getElementById("result").innerHTML =
        "ได้รางวัล: " + data.reward;

    document.getElementById("score").innerHTML =
        "Score: " + data.totalScore;

    document.getElementById("plays").innerHTML =
        "เหลือครั้ง: " + data.playsLeft;
};

document.getElementById("claimBtn").onclick = async () => {
    if (!walletAddress) return alert("กรุณาเชื่อมต่อกระเป๋า TON");

    const res = await fetch("/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wallet: walletAddress })
    });

    const data = await res.json();

    if (data.success) {
        alert("คลิกตกลง\nคุณจะได้รับ " + data.amount + " KUBA\n" +
            "ส่ง TON fee เพื่อดำเนินการต่อ");
    } else {
        alert("Claim Error: " + data.error);
    }
};
