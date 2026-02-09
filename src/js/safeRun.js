export const safeRun = (fn) => {
  try {
    fn();
  } catch (err) {
    console.error("Error:", err);
  }
};