let printed = false;

export function printConsoleEasterEgg() {
  if (printed) return;
  printed = true;

  const banner = [
    "%c✦ psst... curious dev ✦",
    "color:#B98DD4;font-family:monospace;font-size:14px;font-weight:bold;",
  ] as const;

  console.log(...banner);
  console.log(
    "%cYou found the console. There's more hidden on this site than what you can see.",
    "color:#8F6BA8;font-family:monospace;",
  );
  console.log(
    "%cOn a keyboard? Try the classic cheat code, anywhere on the page:",
    "color:#8F6BA8;font-family:monospace;",
  );
  console.log(
    "%c↑ ↑ ↓ ↓ ← → ← → B A",
    "color:#9EDDE3;font-family:monospace;font-size:16px;font-weight:bold;",
  );
  console.log(
    "%cOn a touchscreen? Swipe the same pattern, then tap left, tap right.",
    "color:#8F6BA8;font-family:monospace;",
  );
  console.log(
    "%cThere's also a word of power hidden somewhere on this page. Try typing it...",
    "color:#8F6BA8;font-family:monospace;",
  );
}
