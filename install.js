#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const SETTINGS_FILE = path.join(CLAUDE_DIR, "settings.json");
const SOUND_DEST = path.join(CLAUDE_DIR, "icq-uh-oh.mp3");
const SOUND_SRC = path.join(__dirname, "sounds", "icq-uh-oh.mp3");

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

console.log(bold("\n🎵 Claude ICQ Hook installer\n"));

// Platform check
const platform = process.platform;
let playCommand;

if (platform === "darwin") {
  playCommand = `afplay "${SOUND_DEST}"`;
} else if (platform === "linux") {
  playCommand = `mpg123 -q "${SOUND_DEST}" 2>/dev/null || aplay "${SOUND_DEST}" 2>/dev/null`;
} else {
  console.error(red("❌ Windows is not supported yet. macOS and Linux only."));
  process.exit(1);
}

// Create ~/.claude if needed
if (!fs.existsSync(CLAUDE_DIR)) {
  fs.mkdirSync(CLAUDE_DIR, { recursive: true });
}

// Copy sound file
fs.copyFileSync(SOUND_SRC, SOUND_DEST);
console.log(green("✅ Sound file copied to ~/.claude/icq-uh-oh.mp3"));

// Read or create settings.json
let settings = {};
if (fs.existsSync(SETTINGS_FILE)) {
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
  } catch {
    console.warn(yellow("⚠️  Could not parse existing settings.json, will merge carefully"));
    settings = {};
  }
}

// Merge hook — remove any existing ICQ entry first, then add fresh
if (!settings.hooks) settings.hooks = {};
if (!settings.hooks.Stop) settings.hooks.Stop = [];

settings.hooks.Stop = settings.hooks.Stop.filter(
  (entry) =>
    !Array.isArray(entry.hooks) ||
    !entry.hooks.some((h) => h.command && h.command.includes("icq-uh-oh"))
);

settings.hooks.Stop.push({
  matcher: "",
  hooks: [{ type: "command", command: playCommand }],
});

fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
console.log(green("✅ Hook added to ~/.claude/settings.json"));

console.log(`
${bold("All done!")} The classic ICQ "Uh Oh!" will now play after every Claude Code response.

${yellow("→ Restart Claude Code to apply the changes.")}
`);
