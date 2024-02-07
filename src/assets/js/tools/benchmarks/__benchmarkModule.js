// Function to parse using parser.parseFromString
function parseWithParser(soup) {
  return parser.parseFromString(soup, 'text/html');
}

// Function to parse using parse
function parseWithCustomParser(soup) {
  return parse(soup);
}

// Function to parse using parser.parseFromString
function parseWithParserUnstripped(soup) {
  return parser.parseFromString(soup, 'text/html');
}

// Function to parse using parse
function parseWithCustomParserUnstripped(soup) {
  return parse(soup);
}

// Function to measure execution time
function measureExecutionTime(func, args) {
  const start = performance.now();
  func(...args);
  const end = performance.now();
  return end - start;
}


// Benchmarking
const iterations = 1000; // Adjust this as needed
let totalTimeParser = 0;
let totalTimeCustomParser = 0;
let totalTimeParserUnstripped = 0;
let totalTimeCustomParserUnstripped = 0;

for (let i = 0; i < iterations; i++) {
  totalTimeParser += measureExecutionTime(parseWithParser, [soup]);
  totalTimeCustomParser += measureExecutionTime(parseWithCustomParser, [soup]);
  totalTimeParserUnstripped += measureExecutionTime(parseWithParserUnstripped, [data]);
  totalTimeCustomParserUnstripped += measureExecutionTime(parseWithCustomParserUnstripped, [data]);
}

// Calculate average time
const averageTimeParser = totalTimeParser / iterations;
const averageTimeCustomParser = totalTimeCustomParser / iterations;
const averageTimeParserUnstripped = totalTimeParserUnstripped / iterations;
const averageTimeCustomParserUnstripped = totalTimeCustomParserUnstripped / iterations;

console.log("Average time taken by parser.parseFromString:", averageTimeParser, "milliseconds");
console.log("Average time taken by custom parser:", averageTimeCustomParser, "milliseconds");

console.log("Average time taken by parser.parseFromString (unstripped):", averageTimeParserUnstripped, "milliseconds");
console.log("Average time taken by custom parser (unstripped):", averageTimeCustomParserUnstripped, "milliseconds");


