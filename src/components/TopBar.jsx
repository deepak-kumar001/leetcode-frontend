export default function TopBar({ lang, setLang, autosave, setAutosave }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="checkbox"
          checked={autosave}
          onChange={(e) => setAutosave(e.target.checked)}
        />
        Autosave
      </label>
    </div>
  );
}
