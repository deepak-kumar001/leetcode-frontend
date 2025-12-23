export function getVerdict(result, mode) {
  // mode: "run" | "submit"

  // Compile / runtime errors (both run & submit)
  if (result.compile_error) return "Compile Error";
  if (result.runtime_error) return "Runtime Error";

  if (mode === "run") {
    // 🔥 THIS IS THE KEY FIX
    if (result.correct_answer === false) return "Wrong Answer";

    // Sometimes run_success exists
    if (result.run_success === false) return "Runtime Error";

    return "Accepted";
  }

  // submit
  return result.status_msg || "Unknown";
}
