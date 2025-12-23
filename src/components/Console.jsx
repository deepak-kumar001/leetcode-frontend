
export default function Console({ output, testcases, setTestcases, onRun, onSubmit }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        <button onClick={onRun}>▶ Run</button>
        <button onClick={onSubmit}>🚀 Submit</button>
      </div>
      <textarea
        rows={4}
        placeholder="Custom testcases (optional)"
        value={testcases}
        onChange={(e) => setTestcases(e.target.value)}
      />
      <div style={{ flex: 1, background: "#0b0b0b", marginTop: 6, padding: 8 }}>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
