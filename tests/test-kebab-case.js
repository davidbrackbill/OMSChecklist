// Test the kebabCase function used for generating OMSCentral review URLs

const OLD_IMPL = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const NEW_IMPL = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const CASES = [
  // Courses with hyphens (main fixes)
  ["Knowledge-Based AI", "knowledge-based-ai"],
  ["Human-Computer Interaction", "human-computer-interaction"],
  ["High-Performance Computer Architecture", "high-performance-computer-architecture"],
  ["Introduction to Cyber-Physical Systems Security", "introduction-to-cyber-physical-systems-security"],
  ["Cyber-Physical Security in Electric Energy Systems", "cyber-physical-security-in-electric-energy-systems"],
  ["Special Topics: Compilers - Theory and Practice", "special-topics-compilers-theory-and-practice"],
  ["Special Topics: High-Dimensional Data Analytics", "special-topics-high-dimensional-data-analytics"],
  ["Introduction to Cyber-Physical Electric Energy Systems", "introduction-to-cyber-physical-electric-energy-systems"],

  // Edge cases
  ["Course With  Multiple   Spaces", "course-with-multiple-spaces"],
  ["Course--With--Hyphens", "course-with-hyphens"],
  ["Course With Special!@#$%Characters", "course-with-specialcharacters"],
  ["  Leading and Trailing Spaces  ", "leading-and-trailing-spaces"],
  ["MixedCASE-and-hyphens", "mixedcase-and-hyphens"],

  // Regular courses
  ["Machine Learning", "machine-learning"],
  ["Artificial Intelligence", "artificial-intelligence"],
  ["Graduate Introduction to Operating Systems", "graduate-introduction-to-operating-systems"]
];

const test = (impl, cases) =>
  cases.map(([input, expected]) => ({
    input,
    expected,
    actual: impl(input),
    pass: impl(input) === expected
  }));

const oldResults = test(OLD_IMPL, CASES);
const newResults = test(NEW_IMPL, CASES);

console.log("kebabCase URL Formatter Tests\n" + "=".repeat(80));

newResults.forEach((result, i) => {
  const fixed = !oldResults[i].pass && result.pass;
  const icon = result.pass ? "✅" : "❌";
  const fixIcon = fixed ? " 🔧" : "";

  console.log(`\n${icon}${fixIcon} "${result.input}"`);
  console.log(`   → ${result.actual}`);
  if (!result.pass) {
    console.log(`   Expected: ${result.expected}`);
  }
});

const summary = {
  old: { passed: oldResults.filter(r => r.pass).length, failed: oldResults.filter(r => !r.pass).length },
  new: { passed: newResults.filter(r => r.pass).length, failed: newResults.filter(r => !r.pass).length },
  fixed: newResults.filter((r, i) => !oldResults[i].pass && r.pass).length
};

console.log("\n" + "=".repeat(80));
console.log(`Old: ${summary.old.passed}/${CASES.length} | New: ${summary.new.passed}/${CASES.length} | Fixed: ${summary.fixed}`);

if (summary.new.failed > 0) process.exit(1);
console.log("\n✅ All tests passed!");
