// Run with: node scripts/check-generative.ts
// Node v24 strips types natively, so this file uses erasable syntax only.
import { flowField, hashSeed, mulberry32 } from "../src/lib/generative.ts";

const failures: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

// a. Determinism
const runA1 = JSON.stringify(flowField("QWeb.dev", 400, 300));
const runA2 = JSON.stringify(flowField("QWeb.dev", 400, 300));
check(runA1 === runA2, "flowField is not deterministic for the same seed");

// b. Different seeds produce different output
const seedB1 = JSON.stringify(flowField("QWeb.dev", 400, 300));
const seedB2 = JSON.stringify(flowField("Prospect Predictor", 400, 300));
check(seedB1 !== seedB2, "flowField output is identical for different seeds");

// c. Bounds, counts, and stroke properties
const strokesC = flowField("Universal: AI Art Director", 400, 400);
check(strokesC.length >= 20, `expected >= 20 strokes, got ${strokesC.length}`);
for (const [i, stroke] of strokesC.entries()) {
  check(stroke.points.length >= 2, `stroke ${i} has fewer than 2 points`);
  check(
    stroke.width >= 0.4 && stroke.width <= 1.2,
    `stroke ${i} width ${stroke.width} outside [0.4, 1.2]`,
  );
  check(
    stroke.alpha >= 0.25 && stroke.alpha <= 0.9,
    `stroke ${i} alpha ${stroke.alpha} outside [0.25, 0.9]`,
  );
  for (const [x, y] of stroke.points) {
    if (!(x >= 0 && x <= 400 && y >= 0 && y <= 400)) {
      failures.push(`stroke ${i} point (${x}, ${y}) out of bounds`);
      break;
    }
  }
}

// d. hashSeed
const hEmpty = hashSeed("");
const hAbc = hashSeed("abc");
const isU32 = (n: number) => Number.isInteger(n) && n >= 0 && n < 2 ** 32;
check(isU32(hEmpty), `hashSeed("") not a u32 integer: ${hEmpty}`);
check(isU32(hAbc), `hashSeed("abc") not a u32 integer: ${hAbc}`);
check(hEmpty !== hAbc, "hashSeed(\"\") equals hashSeed(\"abc\")");

// e. mulberry32 range
const rng = mulberry32(42);
let rangeOk = true;
for (let i = 0; i < 1000; i++) {
  const v = rng();
  if (!(v >= 0 && v < 1)) {
    rangeOk = false;
    break;
  }
}
check(rangeOk, "mulberry32(42) produced a value outside [0, 1) in 1000 calls");

if (failures.length > 0) {
  for (const message of failures) console.error(`FAIL: ${message}`);
  process.exit(1);
}
console.log("PASS");
process.exit(0);
