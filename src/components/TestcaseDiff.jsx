export default function TestcaseDiff({ result }) {
  if (
    !result ||
    !Array.isArray(result.code_answer) ||
    !Array.isArray(result.expected_code_answer)
  ) {
    return null;
  }

  const total = Math.min(
    result.total_testcases || result.code_answer.length,
    result.code_answer.length,
    result.expected_code_answer.length
  );

  const stdouts = Array.isArray(result.std_output_list)
    ? result.std_output_list
    : [];

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Test Case Results</h4>

      {Array.from({ length: total }).map((_, i) => {
        const yourOut = result.code_answer[i];
        const expectedOut = result.expected_code_answer[i];
        const printedOut = stdouts[i];
        const passed = result.compare_result?.[i] === "1";

        return (
          <div
            key={i}
            style={{
              border: "1px solid #333",
              padding: 10,
              marginBottom: 10,
              background: passed ? "#0e1a13" : "#1a0e0e",
            }}
          >
            {/* Header */}
            <div
              style={{
                fontWeight: "bold",
                color: passed ? "#4caf50" : "#f44336",
                marginBottom: 6,
              }}
            >
              Test Case {i + 1} {passed ? "✓" : "✗"}
            </div>

            {/* Your Output */}
            <div style={{ marginBottom: 6 }}>
              <b>Your Output</b>
              <pre
                style={{
                  color: passed ? "#4caf50" : "#f44336",
                  whiteSpace: "pre-wrap",
                }}
              >
                {yourOut || "(empty)"}
              </pre>
            </div>

            {/* Expected Output */}
            <div style={{ marginBottom: 6 }}>
              <b>Expected Output</b>
              <pre
                style={{
                  color: "#4caf50",
                  whiteSpace: "pre-wrap",
                }}
              >
                {expectedOut || "(empty)"}
              </pre>
            </div>

            {/* 🔥 Printed Output (stdout) */}
            {printedOut && (
              <div>
                <b>Printed Output</b>
                <pre
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid #333",
                    padding: 6,
                    marginTop: 4,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: "#ddd",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {printedOut}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
