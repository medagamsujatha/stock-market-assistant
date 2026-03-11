## Packages
(none needed beyond base stack)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["Inter", "sans-serif"],
  display: ["Space Grotesk", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"],
}

The UI is designed as a strict dark-mode quant terminal.
Assumes @shared/routes exports the api and buildUrl as specified.
Assumes @shared/schema exports positions and insertPositionSchema.
