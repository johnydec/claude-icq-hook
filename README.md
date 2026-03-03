# claude-icq-hook

Plays the classic ICQ **"Uh Oh!"** sound after every [Claude Code](https://claude.ai/claude-code) response.

## Install

```bash
npx claude-icq-hook
```

That's it. Restart Claude Code and enjoy the nostalgia.

## What it does

Adds a `Stop` hook to `~/.claude/settings.json` that plays the iconic ICQ incoming message sound every time Claude finishes a response.

## Requirements

- macOS or Linux
- [Claude Code](https://claude.ai/claude-code) installed
- Node.js ≥ 14

## Uninstall

Remove the hook from `~/.claude/settings.json` and delete `~/.claude/icq-uh-oh.mp3`.

## License

MIT
