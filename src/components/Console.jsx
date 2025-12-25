export default function Console({
  testcases,
  setTestcases,
  onRun,
  onSubmit,
  execState,
}) {
  const running = execState === "running";
  const submitting = execState === "submitting";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        <button onClick={onRun} disabled={running || submitting}>
          {running ? "⏳ Running..." : "▶ Run"}
        </button>

        <button onClick={onSubmit} disabled={running || submitting}>
          {submitting ? "⏳ Submitting..." : "🚀 Submit"}
        </button>
      </div>

      <div style={{paddingLeft:3}}><strong>Testcases:</strong></div>
      <textarea style={{ padding: 5 }}
        rows={6}
        placeholder="Custom testcases (optional)"
        value={testcases}
        onChange={(e) => setTestcases(e.target.value)}
        disabled={running || submitting}
      />

      {(running || submitting) && (
        <div
          style={{
            marginTop: 8,
            padding: 8,
            background: "#121212",
            color: "#aaa",
            fontStyle: "italic",
          }}
        >
          {running && "Running your code..."}
          {submitting && "Submitting your solution..."}
        </div>
      )}
    </div>
  );
}
