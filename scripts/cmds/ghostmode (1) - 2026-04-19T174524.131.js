const fs = require("fs-extra");
const path = require("path");

const configPath = path.join(__dirname, "../../ghostConfig.json");
const OWNER_UID = "61576396811594";

module.exports = {
  config: {
    name: "ghostmode",
    aliases: ["gmode", "mode"],
    version: "1.0",
    author: "Rakib Islam",
    role: 2,
    shortDescription: "Toggle Private/Public mode",
    longDescription: "Switch Ghost Bot between private (owner only) and public (everyone) mode",
    category: "owner",
    guide: {
      en: "{p}ghostmode private | {p}ghostmode public | {p}ghostmode status"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (event.senderID !== OWNER_UID) {
      return message.reply("👻 Only the bot owner can change mode!");
    }

    const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const action = args[0]?.toLowerCase();

    if (!action || action === "status") {
      return message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗠𝗢𝗗𝗘
━━━━━━━━━━━━━━━━
Current Mode: ${cfg.mode === "private" ? "🔒 PRIVATE" : "🌐 PUBLIC"}

🔒 Private: Only owner (you) can use commands
🌐 Public: Everyone can use commands

Usage:
.ghostmode private
.ghostmode public
━━━━━━━━━━━━━━━━`);
    }

    if (!["private", "public"].includes(action)) {
      return message.reply("Usage: .ghostmode private / .ghostmode public");
    }

    cfg.mode = action;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));

    await message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗠𝗢𝗗𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗
━━━━━━━━━━━━━━━━
${action === "private" ? "🔒 PRIVATE MODE ACTIVATED\nOnly you (owner) can use commands now." : "🌐 PUBLIC MODE ACTIVATED\nEveryone can use commands now."}
━━━━━━━━━━━━━━━━
👻 Ghost Bot — Powered by Darkness`);
  }
};
