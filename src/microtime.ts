const start = Date.now() * 1000;
const hrStart = process.hrtime();

// Return current time in microseconds
export default () => {
  const [seconds, nanoseconds] = process.hrtime(hrStart);

  return start + seconds * 1e6 + Math.round(nanoseconds * 0.001);
};
