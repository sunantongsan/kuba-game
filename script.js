let hitsLeft = 5;
let adsCount = 0;
let kubaBalance = 0;

document.getElementById("hitEgg").onclick = () => {
    if (hitsLeft <= 0) {
        alert("วันนี้ตีไข่ครบแล้ว! ดูโฆษณาเพื่อเพิ่มครั้ง");
        return;
    }

    const reward = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    kubaBalance += reward;
    hitsLeft--;

    document.getElementById("hitsLeft").innerText = hitsLeft;
    document.getElementById("kubaBalance").innerText = kubaBalance;

    document.getElementById("result").innerText = `คุณได้ ${reward} KUBA!`;
};

document.getElementById("watchAd").onclick = () => {

    show_10194784().then(() => {
        adsCount++;
        document.getElementById("adsCount").innerText = adsCount;
        alert("คุณดูโฆษณาแล้ว +1");
    });
};

// ปุ่มเคลมเหรียญ → ส่งไป server.js
document.getElementById("claim").onclick = async () => {
    const res = await fetch("/claim", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({amount: kubaBalance})
    });

    const data = await res.json();
    alert(data.message);
};
