const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const W = 500, H = 800;
const UID = "61575436812912"; // Rakib Islam UID
const AVATAR_URL = `https://graph.facebook.com/${UID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
const FALLBACK_AVATAR = "https://i.ibb.co/v4m0f5V/neon-anime-boy.jpg"; 

async function drawPremiumFrame(ctx, x, y, size) {
  ctx.save();
  // Outer Glow
  ctx.shadowColor = "#ffcc00";
  ctx.shadowBlur = 25;
  
  // Metallic Gold Hexagon Frame
  const sides = 6;
  const radius = size / 2 + 10;
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 / sides) * i;
    const hx = x + size/2 + Math.cos(angle) * radius;
    const hy = y + size/2 + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.strokeStyle = "#ffcc00";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}

async function drawPage(ctx) {
  // --- Carbon Fiber Texture Background ---
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);
  
  ctx.strokeStyle = "rgba(255, 204, 0, 0.03)";
  for (let i = 0; i < W + H; i += 10) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(0, i); ctx.stroke();
  }

  // --- Avatar Logic ---
  let img;
  try { img = await loadImage(AVATAR_URL); } 
  catch { img = await loadImage(FALLBACK_AVATAR); }

  await drawPremiumFrame(ctx, W / 2 - 90, 80, 180);

  ctx.save();
  ctx.beginPath();
  ctx.arc(W / 2, 170, 90, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, W / 2 - 90, 80, 180, 180);
  ctx.restore();

  // --- Typography (Different Fonts & Styles) ---
  ctx.textAlign = "center";
  
  // Name with Gradient
  const nameGrad = ctx.createLinearGradient(0, 300, 0, 360);
  nameGrad.addColorStop(0, "#ffffff");
  nameGrad.addColorStop(1, "#ffcc00");
  
  ctx.font = "bold 45px 'Segoe UI', Arial";
  ctx.fillStyle = nameGrad;
  ctx.fillText("RAKIB ISLAM", W / 2, 330);

  ctx.font = "20px 'Courier New', monospace";
  ctx.fillStyle = "#888";
  ctx.fillText("— SYSTEM ARCHITECT —", W / 2, 360);

  // --- Professional Info Slate ---
  const slateY = 410;
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  ctx.strokeStyle = "rgba(255, 204, 0, 0.2)";
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(40, slateY, W - 80, 320, 15) : ctx.rect(40, slateY, W - 80, 320);
  ctx.fill();
  ctx.stroke();

  const details = [
    { k: "POSITION", v: "Dev of GHOST NET" },
    { k: "STATUS", v: "Student" },
    { k: "CLASS", v: "Secret" },
    { k: "HOBBIES", v: "Code • Travel • Game" },
    { k: "ORIGIN", v: "Saidpur, Rangpur" },
    { k: "CONTACT", v: `fb.com/${UID}` }
  ];

  let currentY = slateY + 50;
  details.forEach(item => {
    ctx.textAlign = "left";
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#ffcc00";
    ctx.fillText(item.k, 70, currentY);

    ctx.textAlign = "right";
    ctx.font = "18px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(item.v, W - 70, currentY);
    
    // Separator Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath(); ctx.moveTo(70, currentY + 12); ctx.lineTo(W - 70, currentY + 12); ctx.stroke();
    
    currentY += 45;
  });

  // Footer Tag
  ctx.textAlign = "center";
  ctx.font = "italic 15px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText("© 2026 GHOST-NET ECOSYSTEM", W / 2, H - 30);
}

module.exports = {
  config: {
    name: "owner",
    aliases: ["admin", "rakib"],
    version: "3.5",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Executive Owner Card",
    category: "system"
  },

  onStart: async function ({ message }) {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");
    await drawPage(ctx);

    const filePath = path.join(__dirname, "cache", `owner_${Date.now()}.png`);
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
    return message.reply({ attachment: fs.createReadStream(filePath) }, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }
};
