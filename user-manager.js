// user-manager.js
let userId = window.Telegram.WebApp.initDataUnsafe.user?.id || Math.random().toString(36).substr(2, 9);
let users = JSON.parse(localStorage.getItem('kubaUsers') || '{}');
if (!users[userId]) users[userId] = { points: 0, kuba: 0, lastOnline: Date.now() };
users[userId].lastOnline = Date.now();
localStorage.setItem('kubaUsers', JSON.stringify(users));

// เช็คอันดับและสถานะ
function showRank() {
    let sortedUsers = Object.entries(users).sort((a, b) => b[1].kuba - a[1].kuba);
    let rank = sortedUsers.findIndex(u => u[0] === userId) + 1;
    let totalUsers = sortedUsers.length;
    let online = sortedUsers.filter(u => Date.now() - u[1].lastOnline < 300000).length; // <5 นาที
    document.getElementById('status').innerHTML = `
        Your Rank: ${rank}/${totalUsers}<br>
        KUBA: ${users[userId].kuba}<br>
        Online: ${online}/${totalUsers}
    `;
}

// เพิ่ม KUBA (เรียกจากเกม)
function addKuba(amount) {
    users[userId].kuba += amount;
    localStorage.setItem('kubaUsers', JSON.stringify(users));
    showRank();
}

// อัปโหลดไป GitHub
async function uploadToGitHub() {
    let data = JSON.stringify(users, null, 2);
    let response = await fetch('https://api.github.com/repos/sunantongsan/kuba-game/contents/users-data.json', {
        method: 'PUT',
        headers: {
            'Authorization': 'token YOUR_GITHUB_TOKEN', // สร้างที่ github.com/settings/tokens (repo scope)
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update user data',
            content: btoa(data)
        })
    });
    console.log('Uploaded:', await response.json());
}

// เรียกอัปโหลดทุก 24 ชม.
setInterval(uploadToGitHub, 86400000);

// Export ฟังก์ชันให้เรียกจาก index.html
window.showRank = showRank;
window.addKuba = addKuba;