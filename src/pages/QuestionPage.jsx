import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Console from "../components/Console";
import TopBar from "../components/TopBar";
import Tabs from "../components/Tabs";
import ResultView from "../components/ResultView";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apiFetch } from "../utils/api";
import Footer from "../components/Footer";
import {
  parseMetaData,
  parseStructuredTestcases,
  stringifyStructuredTestcases,
} from "../utils/testcaseUtils";


export default function QuestionPage() {
  const { slug } = useParams();

  const [hydrated, setHydrated] = useState(false);
  const [lang, setLang] = useLocalStorage("lc:language", "cpp");
  const [questionId, setQuestionId] = useState(null);
  const [autosave, setAutosave] = useLocalStorage("lc:autosave", true);
  const [code, setCode] = useState("");
  const [question, setQuestion] = useState(null);
  const [testcases, setTestcases] = useState("");
  const [structuredCases, setStructuredCases] = useState([]);
  const [meta, setMeta] = useState(null);

  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("question");
  const [mode, setMode] = useState(null); // "run" | "submit"
  const [execState, setExecState] = useState("idle"); // "idle" | "running" | "submitting"
  const [snippets, setSnippets] = useState([]);
  const [activeLang, setActiveLang] = useState(lang);

  const codeKey = `lc:code:${slug}:${lang}`;

  // Load question + code
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await apiFetch(`/api/question/${slug}`);
      const data = await res.json();

      if (cancelled) return;

      setQuestion(data.question);
      setTestcases(data.question.exampleTestcases || "");
      setSnippets(data.question.codeSnippets);

      setQuestionId(data.question.questionId);
      setActiveLang(lang);

      const metaParsed = parseMetaData(data.question.metaData);
      setMeta(metaParsed);

      if (data.question.exampleTestcaseList && metaParsed) {
        const parsedCases = parseStructuredTestcases(
          data.question.exampleTestcaseList,
          metaParsed
        );
        setStructuredCases(parsedCases);
      }


      // ✅ mark hydration complete
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!snippets.length) return;

    const snippet = snippets.find(s => s.langSlug === lang);
    const template = snippet?.code || "";

    const saved = localStorage.getItem(`lc:code:${slug}:${lang}`);
    setCode(saved ? JSON.parse(saved) : template);

    setActiveLang(lang);
  }, [lang, snippets, slug]);

  // Autosave
  useEffect(() => {
    if (!hydrated) return; // CRITICAL LINE
    if (!autosave) return;

    // 🔥 only save if editor language matches selected language
    if (activeLang !== lang) return;

    localStorage.setItem(codeKey, JSON.stringify(code));
  }, [code, autosave, codeKey, hydrated, activeLang, lang]);


  async function run() {
    if (execState !== "idle") return;

    setExecState("running");
    setMode("run");
    setTab("submission");
    setResult(null);

    const finalInput = structuredCases.length
      ? stringifyStructuredTestcases(structuredCases)
      : testcases;

    try {
      const res = await apiFetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          questionId,
          lang,
          typed_code: code,
          data_input: finalInput,
          // data_input: textcases,
        }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult({
        status_msg: "Runtime Error",
        compile_error: err.message,
      });
    } finally {
      setExecState("idle");
    }
  }


  async function submit() {
    if (execState !== "idle") return;

    setExecState("submitting");
    setMode("submit");
    setTab("submission");
    setResult(null);

    try {
      const res = await apiFetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          questionId,
          lang,
          typed_code: code,
        }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult({
        status_msg: "Runtime Error",
        compile_error: err.message,
      });
    } finally {
      setExecState("idle");
    }
  }


  if (!question) return <div>Loading...</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh" }}>
      {/* LEFT */}
      <div style={{ overflow: "auto" }}>
        <Tabs active={tab} setActive={setTab} />

        {tab === "question" && (
          <div style={{ padding: 16 }}>
            <h2>{question.title}</h2>
            <div><b>Difficulty:</b> {question.difficulty}</div>
            <div dangerouslySetInnerHTML={{ __html: question.content }} />
          </div>
        )}

        {tab === "submission" && <ResultView result={result} mode={mode} />}
      </div>

      {/* RIGHT */}
      <div style={{ display: "grid", gridTemplateRows: "40px 1fr 250px" }}>
        <TopBar
          lang={lang}
          setLang={setLang}
          autosave={autosave}
          setAutosave={setAutosave}
        />

        <CodeEditor key={lang} language={lang} code={code} onChange={setCode} />

        <Console
          structuredCases={structuredCases}
          setStructuredCases={setStructuredCases}
          testcases={testcases}
          setTestcases={setTestcases}
          onRun={run}
          onSubmit={submit}
          execState={execState}
        />
        {/* <Console
          testcases={testcases}
          setTestcases={setTestcases}
          onRun={run}
          onSubmit={submit}
          execState={execState}
        /> */}
      </div>
      <Footer />
    </div>
  );
}

