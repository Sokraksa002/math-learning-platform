import { BlockMath, InlineMath } from "react-katex";
import { evaluate } from "mathjs";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Slider,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLesson } from "../utils/api";
import { isLoggedIn } from "../utils/auth";
import type { Lesson } from "../utils/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
} from "recharts";

/* ✅ LATEX FORMAT */
function toLatex(expr: string) {
  return expr
    .replace(/(\d+)\s*\/\s*(\d+)/g, "\\frac{$1}{$2}")
    .replace(/sqrt\((.*?)\)/g, "\\sqrt{$1}")
    .replace(/([a-zA-Z0-9])\^(\d+)/g, "$1^{$2}");
}

/* ✅ TEXT RENDER (SMART) */
function renderTextWithMath(text: string) {
  if (
    text.includes("\\") ||
    text.includes("^") ||
    text.includes("=") ||
    text.includes("∫")
  ) {
    return <InlineMath math={toLatex(text)} />;
  }
  return text;
}

/* ✅ GRAPH DATA */
function generateGraphData(func: string, a: number) {
  const data: { x: number; y: number }[] = [];

  for (let x = -10; x <= 10; x += 0.2) {
    try {
      const y = evaluate(`${a} * (${func})`, { x });
      if (isFinite(y)) data.push({ x, y });
    } catch {
      // ignore invalid
    }
  }
  return data;
}

/* ✅ INTERSECTION */
function findIntersection(f1: string, f2: string, a: number) {
  for (let x = -10; x <= 10; x += 0.05) {
    try {
      const y1 = evaluate(`${a} * (${f1})`, { x });
      const y2 = evaluate(`${a} * (${f2})`, { x });

      if (Math.abs(y1 - y2) < 0.1) {
        return { x, y: y1 };
      }
    } catch {
      // ignore invalid
    }
  }
  return null;
}

/* ✅ TYPES */
type LessonBlock =
  | { type: "text"; value: string }
  | { type: "formula"; value: string }
  | { type: "graph"; config?: { function?: string } };

type LessonContent = {
  contentJson?: { blocks?: LessonBlock[] };
};

export default function LessonDetail() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [graphParam, setGraphParam] = useState(1);

  useEffect(() => {
    const load = async () => {
      if (!lessonId) return;

      try {
        const data = await getLesson(lessonId);
        setLesson(data ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const handleComplete = () => {
    if (!lessonId) return;

    if (!isLoggedIn()) {
      navigate(`/login?next=/lesson/${lessonId}`);
      return;
    }

    setCompleted(true);
  };

  /* ✅ RENDER */
  const renderBlocks = () => {
    const blocks =
      (lesson as Lesson & LessonContent)?.contentJson?.blocks ?? [];

    return blocks.map((block, i) => {
      /* ✅ TEXTBOOK STYLE TEXT */
      if (block.type === "text") {
        const isHeading = /^[០-៩0-9]+\./.test(block.value);

        if (isHeading) {
          return (
            <Typography
              key={i}
              sx={{ mt: 4, fontWeight: 700, fontSize: 18 }}
            >
              {block.value}
            </Typography>
          );
        }

        return (
          <Typography
            key={i}
            sx={{
              mb: 2,
              lineHeight: 2.2,
              textAlign: "justify",
              textIndent: "32px",
              fontSize: 17,
            }}
          >
            {renderTextWithMath(block.value)}
          </Typography>
        );
      }

      /* ✅ FORMULA (ALIGNED LIKE BOOK) */
      if (block.type === "formula") {
        return (
          <Box key={i} sx={{ textAlign: "center", my: 3 }}>
            <BlockMath
              math={`\\begin{aligned}
              ${toLatex(block.value).replace(/\n/g, "\\\\")}
              \\end{aligned}`}
            />
          </Box>
        );
      }

      /* ✅ GRAPH */
      if (block.type === "graph") {
        const raw = block.config?.function || "x";
        const clean = raw.replace("±", "");
        const hasPM = raw.includes("±");

        const funcs = hasPM ? [clean, "-" + clean] : [clean];

        const intersection =
          funcs.length === 2
            ? findIntersection(funcs[0], funcs[1], graphParam)
            : null;

        return (
          <Box key={i} sx={{ my: 4 }}>
            <Box textAlign="center" mb={2}>
              <InlineMath
                math={`y = ${graphParam} \\cdot ${toLatex(clean)}`}
              />
            </Box>

            <Slider
              value={graphParam}
              onChange={(_, v) => setGraphParam(v as number)}
              min={-5}
              max={5}
              step={0.5}
            />

            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" />
                  <YAxis />
                  <Tooltip />

                  {funcs.map((f, idx) => (
                    <Line
                      key={idx}
                      data={generateGraphData(f, graphParam)}
                      dataKey="y"
                      stroke={
                        idx === 0 ? "#2563EB" : "#DC2626"
                      }
                      dot={false}
                    />
                  ))}

                  {intersection && (
                    <Scatter data={[intersection]} fill="black" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {intersection && (
              <Typography textAlign="center" mt={1}>
                Intersection ≈ (
                {intersection.x.toFixed(2)},{" "}
                {intersection.y.toFixed(2)})
              </Typography>
            )}
          </Box>
        );
      }

      return null;
    });
  };

  return (
    <Box sx={{ background: "#F8FAFC", py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <Typography>Loading...</Typography>
          ) : !lesson ? (
            <Typography>No lesson</Typography>
          ) : (
            <>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: 800,
                  mb: 4,
                }}
              >
                {typeof lesson.title === "string"
                  ? lesson.title
                  : lesson.title?.en ||
                    lesson.title?.km ||
                    "Lesson"}
              </Typography>

              {renderBlocks()}

              <Stack direction="row" spacing={2} mt={4}>
                <Button onClick={() => navigate(-1)}>
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={handleComplete}
                >
                  {completed
                    ? "✅ Completed"
                    : "Complete Lesson"}
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}