import TestcaseDiff from "./TestcaseDiff";
import { getVerdict } from "../utils/verdict";

export default function ResultView({ result, mode }) {
  if (!result) return <div>No result yet.</div>;

  const verdict = getVerdict(result, mode);

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 8,
          color:
            verdict === "Accepted"
              ? "#4caf50"
              : verdict === "Wrong Answer"
              ? "#ff9800"
              : "#f44336",
        }}
      >
        {verdict}
      </div>

      {/* Testcase summary */}
      {result.total_testcases != null && (
        <div style={{ marginBottom: 10 }}>
          Passed:{" "}
          <b>
            {result.total_correct}/{result.total_testcases}
          </b>
        </div>
      )}

      {/* Compile error */}
      {result.compile_error && (
        <>
          <h4>Compile Error</h4>
          <pre style={{ color: "#f44336" }}>
            {result.full_compile_error}
          </pre>
        </>
      )}

      {/* Runtime / Memory */}
      {result.run_success && (
        <div style={{ marginBottom: 8 }}>
          Runtime: {result.status_runtime} <br />
          Memory: {result.status_memory}
        </div>
      )}

      {/* 🔥 Expected vs Actual (RUN only) */}
      {mode === "run" && <TestcaseDiff result={result} />}
    </div>
  );
}
