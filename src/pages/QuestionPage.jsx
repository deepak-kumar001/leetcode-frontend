
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import CodeEditor from "../components/CodeEditor";
// import Console from "../components/Console";
// import LanguageSelector from "../components/LanguageSelector";

// export default function QuestionPage() {
//   const { slug } = useParams();
//   const [question, setQuestion] = useState(null);
//   const [questionId, setQuestionId] = useState(null);
//   const [lang, setLang] = useState("cpp");
//   const [code, setCode] = useState("");
//   const [testcases, setTestcases] = useState("");
//   const [output, setOutput] = useState("");

//   useEffect(() => {
//     loadQuestion(lang);
//   }, [slug, lang]);

//   async function loadQuestion(language) {
//     const res = await fetch(`/api/question/${slug}?lang=${language}`);
//     const data = await res.json();
//     setQuestion(data.question);
//     setCode(data.question.template || "");
//     setQuestionId(data.question.questionId);
//     setTestcases(data.question.exampleTestcases || "");
//     const template = data.question.codeSnippets?.forEach(element => {
//       element.langSlug === lang && setCode(element.code);
//     });
//   }

//   async function run() {
//     setOutput("Running...");
//     const res = await fetch("/api/run", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         slug,
//         questionId,
//         lang,
//         typed_code: code,
//         data_input: testcases,
//       }),
//     });
//     const data = await res.json();
//     setOutput(JSON.stringify(data.result, null, 2));
//   }

//   async function submit() {
//     setOutput("Submitting...");
//     const res = await fetch("/api/submit", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         slug,
//         questionId,
//         lang,
//         typed_code: code,
//       }),
//     });
//     const data = await res.json();
//     setOutput(JSON.stringify(data.result, null, 2));
//   }

//   if (!question) return <div style={{ padding: 20 }}>Loading...</div>;

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh" }}>
//       <div style={{ padding: 16, overflow: "auto" }}>
//         <h2>{question.title}</h2>
//         <div><b>Difficulty:</b> {question.difficulty}</div>
//         <div dangerouslySetInnerHTML={{ __html: question.content }} />
//       </div>

//       <div style={{ display: "grid", gridTemplateRows: "40px 1fr 250px" }}>
//         <div style={{ padding: 6 }}>
//           <LanguageSelector lang={lang} setLang={setLang} />
//         </div>

//         <CodeEditor
//           language={lang === "cpp" ? "cpp" : lang}
//           code={code}
//           onChange={setCode}
//         />

//         <Console
//           output={output}
//           testcases={testcases}
//           setTestcases={setTestcases}
//           onRun={run}
//           onSubmit={submit}
//         />
//       </div>
//     </div>
//   );
// }




import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Console from "../components/Console";
import TopBar from "../components/TopBar";
import Tabs from "../components/Tabs";
import ResultView from "../components/ResultView";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apiFetch } from "../utils/api";

export default function QuestionPage() {
  const { slug } = useParams();

  const [hydrated, setHydrated] = useState(false);
  const [lang, setLang] = useLocalStorage("lc:language", "cpp");
  const [questionId, setQuestionId] = useState(null);
  const [autosave, setAutosave] = useLocalStorage("lc:autosave", true);
  const [code, setCode] = useState("");
  const [question, setQuestion] = useState(null);
  const [testcases, setTestcases] = useState("");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("question");
  const [mode, setMode] = useState(null); // "run" | "submit"
  const [execState, setExecState] = useState("idle"); // "idle" | "running" | "submitting"

  const codeKey = `lc:code:${slug}:${lang}`;

  // Load question + code
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await apiFetch(`/api/question/${slug}?lang=${lang}`);
      const data = await res.json();

      if (cancelled) return;

      setQuestion(data.question);
      setTestcases(data.question.exampleTestcases || "");

      const snippet = data.question.codeSnippets.find(
        (el) => el.langSlug === lang
      );

      const template = snippet?.code || "";

      const saved = localStorage.getItem(codeKey);
      setCode(saved ? JSON.parse(saved) : template);

      setQuestionId(data.question.questionId);

      // ✅ mark hydration complete
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  // Autosave
  useEffect(() => {
    if (!hydrated) return;     // 🔥 CRITICAL LINE
    if (!autosave) return;

    localStorage.setItem(codeKey, JSON.stringify(code));
  }, [code, autosave, codeKey, hydrated]);

  async function run() {
    if (execState !== "idle") return;

    setExecState("running");
    setMode("run");
    setTab("submission");
    setResult(null);

    try {
      const res = await apiFetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          questionId,
          lang,
          typed_code: code,
          data_input: testcases,
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
      <div style={{ display: "grid", gridTemplateRows: "50px 1fr 250px" }}>
        <TopBar
          lang={lang}
          setLang={setLang}
          autosave={autosave}
          setAutosave={setAutosave}
        />

        <CodeEditor key={lang} language={lang} code={code} onChange={setCode} />

        <Console
          testcases={testcases}
          setTestcases={setTestcases}
          onRun={run}
          onSubmit={submit}
          execState={execState}
        />
      </div>
    </div>
  );
}

