export default function Footer() {
  return (
    <footer
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "7px 0",
        fontSize: "13px",
        color: "#888",
        borderTop: "1px solid #222",
        background: "#0f0f0f",
      }}
    >
      Crafted with <span style={{ color: "#e25555" }}>💖</span> by Me
    </footer>
  );
}
