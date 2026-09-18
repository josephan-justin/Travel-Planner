// Mock for puppeteer - avoids ESM parse issues in Jest
module.exports = {
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn().mockResolvedValue(),
      pdf: jest.fn().mockResolvedValue(Buffer.from("mock-pdf-content")),
    }),
    close: jest.fn().mockResolvedValue(),
  }),
};