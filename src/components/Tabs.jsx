export default function Tabs({ active, setActive }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #333", position: "sticky", top: 0, background: "#121212", zIndex: 10 }}>
      {["question", "submission"].map(tab => (
        <div
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderBottom: active === tab ? "2px solid #4caf50" : "none",
            color: active === tab ? "#4caf50" : "#aaa"
          }}
        >
          {tab.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
