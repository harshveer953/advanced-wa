// Simple parser: lines like:
// "2 black tshirt"
// "1 jeans"
// "black tshirt x2"
// "tshirt 2"
//
// Returns: [{ qty, name }]
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseLine = (line) => {
  const raw = normalize(line);
  if (!raw) return null;

  // patterns
  // 1) "2 tshirt"
  let m = raw.match(/^(\d+)\s+(.+)$/);
  if (m) return { qty: Math.max(1, parseInt(m[1], 10)), name: m[2].trim() };

  // 2) "tshirt x2"
  m = raw.match(/^(.+?)\s*x\s*(\d+)$/);
  if (m) return { qty: Math.max(1, parseInt(m[2], 10)), name: m[1].trim() };

  // 3) "tshirt 2"
  m = raw.match(/^(.+?)\s+(\d+)$/);
  if (m) return { qty: Math.max(1, parseInt(m[2], 10)), name: m[1].trim() };

  // default qty 1
  return { qty: 1, name: raw.trim() };
};

const parseWhatsAppOrder = (text) => {
  const lines = String(text || "")
    .split(/\n|,|;/g)
    .map((x) => x.trim())
    .filter(Boolean);

  const items = [];
  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed && parsed.name.length >= 2) items.push(parsed);
  }
  return items;
};

module.exports = { parseWhatsAppOrder, normalize };
