require("@testing-library/jest-dom");
require("dotenv").config();

// Polyfill for TextEncoder/TextDecoder required by Prisma
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
