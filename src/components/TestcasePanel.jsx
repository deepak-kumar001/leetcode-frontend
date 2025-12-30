export default function TestcasePanel({ testcases, setTestcases }) {
  if (!testcases.length) {
    return (
      <div style={{ color: "#888", fontSize: 13 }}>
        No structured testcases available.
      </div>
    );
  }

  function updateValue(tcIndex, inputIndex, value) {
    const next = structuredClone(testcases);
    next[tcIndex].inputs[inputIndex].value = value;
    setTestcases(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>
      {testcases.map((tc, tcIndex) => (
        <div
          key={tc.id}
          style={{
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            padding: 12,
            background: "#111",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#4caf50",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Test Case {tc.id}
          </div>

          {tc.inputs.map((input, inputIndex) => (
            <div
              key={inputIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                alignItems: "center",
                marginBottom: 6,
                gap: 8,
              }}
            >
              <div style={{ fontSize: 12, color: "#aaa" }}>
                {input.name}
                <span style={{ opacity: 0.6 }}> ({input.type})</span>
              </div>

              <input
                value={input.value}
                onChange={(e) =>
                  updateValue(tcIndex, inputIndex, e.target.value)
                }
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "6px 8px",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
