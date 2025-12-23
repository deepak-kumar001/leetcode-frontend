
export default function LanguageSelector({ lang, setLang }) {
  return (
    <select value={lang} onChange={(e) => setLang(e.target.value)}>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
      <option value="python">Python</option>
      <option value="javascript">JavaScript</option>
    </select>
  );
}
