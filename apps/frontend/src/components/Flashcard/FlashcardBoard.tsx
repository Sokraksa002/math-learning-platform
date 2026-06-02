import { useState, useEffect, useRef } from "react";
import { useLocale } from "../../hooks/useLocale";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { getAllLessons, protectedPost } from "../../utils/api";

/* ✅ TYPES */
type LessonResp = {
  id: string;
  fallbackTitle?: string | null;
  titleKm?: string | null;
  title?: { km?: string } | null;
  chapterId?: string;
};

type AiFlashcard = {
  question: string;
  answer: string;
};

type AiFlashcardResponse = {
  flashcards?: AiFlashcard[];
  data?: {
    flashcards?: AiFlashcard[];
  };
};

interface FlashcardData {
  front: string;
  backTitle: string;
  backExplanation: string;
}

const LESSON_TITLE_KM: Record<string, string> = {
  "Complex Numbers": "ចំនួនកុំផ្លិច",
  "Conic Sections": "កោនិក",
  "Derivatives": "ដេរីវេ",
  "Differential Equations": "សមីការឌីផេរ៉ង់ស្យែល",
  "Functions": "អនុគមន៍",
  "Integrals": "អាំងតេក្រាល",
  "Limits": "លីមីត",
  "Probability": "ប្រូបាប៊ីលីតេ",
};

const localizeLessonTitle = (value: string, locale: string): string => {
  if (locale !== "km") return value;
  const lessonMatch = value.match(/^Lesson\s*(\d+)\s*-\s*(.+)$/i);
  if (lessonMatch) {
    const number = lessonMatch[1];
    const subject = lessonMatch[2].trim();
    const translatedSubject = LESSON_TITLE_KM[subject] ?? subject;
    return `មេរៀនទី ${number} - ${translatedSubject}`;
  }
  return LESSON_TITLE_KM[value] ?? value;
};

/* ================= FALLBACK ================= */
function buildFallbackFlashcard(
  question: string,
  lessonLabel?: string
): FlashcardData {
  const topic = question.trim() || "សំណួរ";
  const label = lessonLabel?.trim();
  return {
    front: topic,
    backTitle: "Answer",
    backExplanation: label
      ? `ចម្លើយគំរូសម្រាប់ ${label}: សូមពិនិត្យជំហានដោះស្រាយនៃ ${topic}`
      : `ចម្លើយគំរូ: សូមពិនិត្យជំហានដោះស្រាយនៃ ${topic}`,
  };
}

/* ================= HELPERS ================= */
// function cleanBackExplanation(raw: string): string {
//   if (!raw) return raw;
//   let out = raw;
//   // Remove markdown/code syntax and keep the answer as readable math flow.
//   out = out.replace(/```[a-zA-Z-]*\n?/g, "");
//   out = out.replace(/```/g, "");
//   out = out.replace(/`([^`]+)`/g, "$1");
//   out = out.replace(/\r?\n+/g, "\n");
//   out = out.replace(/[ \t]{2,}/g, " ").trim();
//   out = out.replace(
//     /^\s*(?:Answer|ចម្លើយ|ចម្លើយគឺ|ចម្លើយជា|the answer is|final answer is|ដូច្នេះ|therefore|thus)\s*[:\-\s]*/i,
//     "",
//   );
//   return out;
// }

function formatSolutionFlow(cleaned: string): string {
  if (!cleaned) return cleaned;

  const lines = cleaned
    .replace(/\r?\n+/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\s*(?:Answer|ចម្លើយ)\s*[:\-\s]*$/i.test(line));

  if (lines.length === 0) return cleaned;

  if (lines.length === 1) {
    return lines[0].replace(/^\s*(?:\d+[).៖-]?\s*)/i, "");
  }

  const flowLines = lines.map((line) =>
    line.replace(
      /^\s*(?:\d+[).៖-]?\s*|Answer|ចម្លើយ|ចម្លើយគឺ|ចម្លើយជា|the answer is|final answer is|ដូច្នេះ|therefore|thus)\s*[:\-\s]*/i,
      "",
    ),
  );

  return flowLines.join("\n\n");
}

/* ================= COMPONENT ================= */
export default function FlashcardBoard() {
  const { t, locale } = useLocale();
  const isKhmer = locale === "km";
  const navigate = useNavigate();

  

  const [lessonOptions, setLessonOptions] = useState<
    { label: string; value: string; chapterId?: string }[]
  >([]);
  const [lesson, setLesson] = useState("");
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatedCard = cards[0] ?? null;
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* ================= LOAD LESSONS ================= */
  useEffect(() => {
    getAllLessons().then((lessons) => {
      const mapped = (lessons as LessonResp[]).map((l) => ({
        label: localizeLessonTitle(
          l.title?.km || l.titleKm || l.fallbackTitle || "Untitled",
          locale
        ),
        value: l.id,
        chapterId: l.chapterId ?? undefined,
      }));
      setLessonOptions(mapped);
      setLesson((current) =>
        current && mapped.some((option) => option.value === current)
          ? current
          : mapped[0]?.value || ""
      );
    });
  }, [locale]);

  /* trigger MathJax or re-render math when card changes */
  useEffect(() => {
    const t = setTimeout(() => {
      const w = window as unknown as { MathJax?: { typesetClear?: (els: unknown[]) => void; typesetPromise?: (els: unknown[]) => Promise<void> } };
      if (w.MathJax && cardRef.current) {
        try {
          w.MathJax.typesetClear?.([cardRef.current]);
          w.MathJax.typesetPromise?.([cardRef.current]);
        } catch {
          // ignore
        }
      }
    }, 150);
    return () => clearTimeout(t);
  }, [cards]);

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    if (!isLoggedIn()) {
      navigate(`/login?next=${encodeURIComponent("/flashcard")}`);
      return;
    }
    if (!lesson) return alert(isKhmer ? "សូមជ្រើសរើសមេរៀនសិន" : "Please select a lesson first");

    const selectedLabel = lessonOptions.find((o) => o.value === lesson)?.label || "";
    const topicToSend = topic.trim() || selectedLabel || "សំណួរ";

    setIsGenerating(true);
    try {
      const res = await protectedPost<AiFlashcardResponse>("/api/ai/flashcards", {
        lessonId: lesson,
        topic: topicToSend,
        language: "km",
        save: false,
      });

      const flashcards = res.flashcards || res.data?.flashcards || [];

      if (!flashcards || flashcards.length === 0) {
        throw new Error(isKhmer ? "មិនមានកាតត្រឡប់មកពី AI ទេ" : "No flashcards returned from AI");
      }
const transformedAll: FlashcardData[] = flashcards.map((f) => {
  const frontText = topic.trim() || f.question || selectedLabel || "";

  const raw = f.answer || "";

  // ✅ clean text only (safe)
  const cleaned = raw
  .replace(/```[a-zA-Z-]*\n?/g, "")
  .replace(/```/g, "")
  .replace(/\r?\n+/g, "\n")
  .trim();

// ✅ ✅ ONLY ONE LATEX FIX BLOCK (KEEP THIS ONLY)

let solutionFlow = formatSolutionFlow(cleaned) || cleaned;

//let solutionFlow = cleaned;

// ✅ REMOVE previous formatting first
solutionFlow = solutionFlow
  .replace(/\$\$/g, "")
  .replace(/\$/g, "")
  .replace(/\\\\/g, "\\");

// ✅ fix latex
solutionFlow = solutionFlow
  .replace(/(\d)x2/g, "$1x^2")
  .replace(/x2/g, "x^2")

  .replace(/lim\s*x\s*→\s*(\d+)/g, "\\lim_{x \\to $1}")
  .replace(/\\f/g, "\\frac")
  .replace(/rac/g, "")
  .replace(/(^|[^\\])frac/g, "$1\\frac")
  .replace(/(^|[^\\])sqrt/g, "$1\\sqrt")
  .replace(/(^|[^\\])lim/g, "$1\\lim")
  .replace(/x\s*o\s*/g, "x \\to ")

  // ✅ fix cdot
  .replace(/c\s*dot/g, "\\cdot")
  .replace(/\\cdot/g, "$\\\\cdot$")
  .replace(/\\?cdot/g, "\\cdot");

// ✅ formatting
solutionFlow = solutionFlow
  .replace(/=/g, "\n= ")
  .replace(/ដូចនេះ/g, "\n\nដូចនេះ ");

// ✅ inline math render
solutionFlow = solutionFlow
  .replace(/\\sqrt\{[^}]+\}/g, (m) => `$${m}$`)
  .replace(/\\frac\{[^}]+\}\{[^}]+\}/g, (m) => `$${m}$`)
  .replace(/\\lim_[^{]+\{[^}]+\}/g, (m) => `$${m}$`)
  .replace(/\\cdot/g, (m) => `$${m}$`);

// ✅ FIX ONLY WHAT AI FAILS
solutionFlow = solutionFlow
  .replace(/c\s*dot/g, "\\cdot")
  .replace(/\bcdot(\d)/g, "\\cdot $1"); // fix "cdot2"


solutionFlow = solutionFlow
  .replace(/\\\(/g, "$")
  .replace(/\\\)/g, "$");


// ✅ wrap cdot for KaTeX
solutionFlow = solutionFlow.replace(/\\cdot/g, "$\\\\cdot$");

// ✅ FIX invalid latex from AI
solutionFlow = solutionFlow
  .replace(/\\\(/g, "$")
  .replace(/\\\)/g, "$")
  .replace(/c\s*dot/g, "\\cdot")
  .replace(/\bcdot(\d)/g, "\\cdot $1")
  .replace(/lim\s*x\s*→\s*(\d+)/g, "\\lim_{x \\to $1}")
  .replace(/x2/g, "x^2");

// ✅ REMOVE broken $
solutionFlow = solutionFlow.replace(/\$/g, "");

// ✅ WRAP as full math (important)
if (solutionFlow.includes("\\lim") || solutionFlow.includes("\\cdot")) {
  solutionFlow = `$$${solutionFlow}$$`;
}

// ✅ FORMAT TEXT
solutionFlow = solutionFlow
  .replace(/=/g, "\n= ")
  .replace(/ដូចនេះ/g, "\n\nដូចនេះ ");


// ✅ formatting
solutionFlow = solutionFlow
  .replace(/=/g, "\n= ")
  .replace(/ដូចនេះ/g, "\n\nដូចនេះ ");

solutionFlow = solutionFlow
  .replace(/c\s*dot/g, "\\cdot")
  .replace(/(?<!\\)\bcdot\b/g, "\\cdot"); // safe replace

// wrap only if not already wrapped
solutionFlow = solutionFlow.replace(/\\cdot/g, (m) =>
  m.includes("$") ? m : `$${m}$`
);
// ✅ add multiplication (number)(number) → number \cdot number
solutionFlow = solutionFlow
  .replace(/(\d)\((\d)/g, "$1\\\\cdot $2")
  .replace(/\)(\d)/g, ")\\\\cdot $1");

  // ✅ ✅ MUST BE CONNECTED HERE
 // .replace(/ដូចនេះ/g, "\\\\ដូចនេះ ");

// ✅ remove wrong $
solutionFlow = solutionFlow.replace(/\$+/g, "");

// ✅ wrap ONLY ONCE
if (/\\(frac|sqrt|lim|to|int)/.test(solutionFlow)) {

  solutionFlow = solutionFlow
  .replace(/(\\lim[^=]+)/g, "$$$1$$")
  .replace(/(\\frac[^=]+)/g, "$$$1$$");
  
}

return {
  front: frontText,
  backTitle: isKhmer ? "ចម្លើយ" : "Answer",
  backExplanation: solutionFlow,
};

});

      // only keep the first flashcard (show single answer only)
      const transformed = transformedAll.slice(0, 1);
      setCards(transformed);
    } catch (err) {
      console.error("Flashcard error:", err);
      const fallback = buildFallbackFlashcard(topicToSend, selectedLabel);
      setCards([fallback]);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ✅ CLEAR */
  const handleClear = () => {
    setLesson("");
    setTopic("");
    setCards([]);
    
  };


  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "360px 1fr" },
        minHeight: { xs: "auto", md: "640px" },
        border: "1px solid #D6D6D6",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "#fffdf7",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3.25 },
          borderRight: { xs: "none", md: "1px solid #D6D6D6" },
          background: "linear-gradient(180deg, #ffffff 0%, #fffaf0 100%)",
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 3,
            boxShadow: "none",
            borderColor: "#E5DFCF",
            backgroundColor: "#fff",
          }}
        >
          <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
            {t("components.Flashcard.FlashcardBoard.flashcard", isKhmer ? "កាតរំលឹក" : "Flashcard")}
          </Typography>
          <Typography sx={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
            {isKhmer ? 'បង្កើតកាតរំលឹកអន្តរកម្មសម្រាប់ការពិនិត្យមើលឆាប់រហ័ស' : 'Generate interactive flashcard for fast revision'}
          </Typography>
        </Paper>

        <Stack spacing={1.75}>
          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 14, fontWeight: 600, color: "#334155" }}>{isKhmer ? 'មេរៀន' : 'Lesson'}</Typography>
            <Select
              fullWidth
              value={lesson}
              onChange={(e: SelectChangeEvent) => setLesson(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiSelect-select": { py: 1.4 },
              }}
            >
              {lessonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 14, fontWeight: 600, color: "#334155" }}>{isKhmer ? 'ប្រធានបទ' : 'Topic'}</Typography>
            <TextField
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isKhmer ? 'បញ្ចូលលំហាត់' : 'Enter exercise'}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiInputBase-root": { minHeight: 54 },
              }}
            />
          </Box>

          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={isGenerating}
            sx={{
              minHeight: 48,
              fontWeight: 800,
              backgroundColor: "#F8E8AE",
              color: "#111",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#F5DEA0" },
            }}
          >
            {isGenerating ? (isKhmer ? 'កំពុងបង្កើត...' : 'Generating...') : (isKhmer ? 'បង្កើត' : 'Generate')}
          </Button>
          <Button
            onClick={handleClear}
            variant="contained"
            sx={{
              minHeight: 48,
              fontWeight: 800,
              backgroundColor: "#AEE0F0",
              color: "#111",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#97D2E7" },
            }}
          >
            {isKhmer ? 'សម្អាត' : 'Clear'}
          </Button>
        </Stack>
      </Box>

      {/* RIGHT PANEL */}
      <Box sx={{ p: { xs: 2.5, md: 4.5 }, display: "grid", placeItems: "center", backgroundColor: "#fff" }}>
          {generatedCard ? (
            <Box ref={cardRef} sx={{ width: "100%", maxWidth: 860, minHeight: { xs: 320, md: 500 } }}>
              <Paper
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(180deg, #FFF8E3 0%, #FFF3C8 100%)",
                  border: "1px solid #F2E4B8",
                  p: { xs: 2.5, md: 4.25 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  verflowY: "visible",
                  minHeight: "auto",
                  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.10)",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 900, lineHeight: 1.2 }}>
                    {isKhmer ? 'ចម្លើយ' : generatedCard.backTitle}
                  </Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>
                    {isKhmer ? 'សេចក្តីពន្យល់ខ្លីៗខាងក្រោម' : 'Short explanation below'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mb: 0.5,
                    width: "100%",
                    fontSize: { xs: 15, md: 17 },
                    lineHeight: 1.9,
                    color: "#1F2937",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    "& p": { margin: 0, mb: 1.1 },
                  "& .katex": {
                    whiteSpace: "normal",
                  },
                  "& .katex-display": {
                    overflowX: "auto",
                    margin: "0.6em 0",
                  },
                    "& strong": { fontWeight: 800 },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {generatedCard.backExplanation}
                  </ReactMarkdown>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                maxWidth: 860,
                border: "1px dashed #D1D5DB",
                borderRadius: 4,
                textAlign: "center",
                p: { xs: 3, md: 5 },
                color: "#64748B",
                backgroundColor: "#fff",
              }}
            >
              <Typography sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 700, mb: 1 }}>
                {isKhmer ? 'មិនទាន់មានកាតរំលឹកទេ' : 'No flashcard yet'}
              </Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>
                {isKhmer ? 'ជ្រើសរើសមេរៀន បញ្ចូលប្រធានបទ ហើយចុចបង្កើតដើម្បីមើលជំហានដោះស្រាយ។' : 'Pick a lesson, enter a topic, and generate a card to see the solution flow.'}
              </Typography>
            </Box>
          )}
      </Box>
    </Box>
  );
}
