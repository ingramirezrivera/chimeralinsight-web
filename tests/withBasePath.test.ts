import assert from "node:assert/strict";
import { withBasePath } from "../src/lib/paths";

// Helper para correr casos con/ sin BASE_PATH
function runAllCases(label: string, base: string) {
  process.env.NEXT_PUBLIC_BASE_PATH = base;

  const cases: Array<[input: string, expected: string]> = [
    // básicos
    ["/books/abc/", base + "/books/abc/"],
    ["books/abc/", base + "/books/abc/"],
    ["/launch/tao/", base + "/launch/tao/"],
    ["launch/tao/", base + "/launch/tao/"],

    // estáticos / imágenes
    ["/images/amazon-logo.png", base + "/images/amazon-logo.png"],
    ["images/amazon-logo.png", base + "/images/amazon-logo.png"],

    // anchors / queries (no tocar)
    ["#buy", "#buy"],
    ["?q=search", "?q=search"],

    // absolutas (no tocar)
    ["https://amazon.com", "https://amazon.com"],
    ["http://example.com/page", "http://example.com/page"],

    // vacíos
    ["", ""],
  ];

  for (const [input, expected] of cases) {
    const out = withBasePath(input);
    assert.equal(
      out,
      expected,
      `[${label}] withBasePath("${input}") => "${out}" (expected "${expected}")`
    );
  }
}

function run() {
  // DEV (base vacío)
  runAllCases("dev", "");

  // PROD (como GH Pages)
  runAllCases("prod", "/chimeralinsight-web");

  console.log("✅ withBasePath: todos los casos pasaron en dev y prod");
}

run();
