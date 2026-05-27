import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useLocale } from "../../hooks/useLocale";
import { useEffect, useState } from "react";
import { protectedGet } from "../../utils/api";

// ✅ TYPES
type QuizSession = {
  id: string;
  score: number | null;
  createdAt: string;
};

type ChartData = {
  week: string;
  score: number;
};

// ✅ GROUP BY WEEK
function groupByWeek(sessions: QuizSession[]): ChartData[] {
  const map: Record<string, number[]> = {};

  sessions.forEach((s) => {
    const date = new Date(s.createdAt);

    const weekLabel = `W${getWeekNumber(date)}`;

    if (!map[weekLabel]) map[weekLabel] = [];
    map[weekLabel].push(s.score ?? 0);
  });

  return Object.entries(map).map(([week, scores]) => ({
    week,
    score:
      scores.reduce((sum, s) => sum + s, 0) / scores.length,
  }));
}

// ✅ WEEK NUMBER HELPER
function getWeekNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(
    ((date.getTime() - firstDay.getTime()) / 86400000 +
      firstDay.getDay() +
      1) /
      7
  );
}

export default function ProgressChart() {
  const { t } = useLocale();

  const [data, setData] = useState<ChartData[]>([]);
  const [bestPoint, setBestPoint] = useState<ChartData | null>(null);

  // ✅ LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const sessions = await protectedGet<QuizSession[]>(
          "/api/quiz/history"
        );

        const grouped = groupByWeek(sessions);

        // ✅ find best score
        const best = grouped.reduce(
          (max, curr) => (curr.score > (max?.score ?? 0) ? curr : max),
          grouped[0]
        );

        setData(grouped);
        setBestPoint(best);
      } catch (err) {
        console.error("Chart load failed", err);
      }
    };

    load();
  }, []);

  // ✅ trend text
  const getTrend = () => {
    if (data.length < 2) return "No trend yet";

    const first = data[0].score;
    const last = data[data.length - 1].score;

    if (last > first) return "📈 Improving";
    if (last < first) return "📉 Declining";
    return "➡️ Stable";
  };

  return (
    <Card sx={{ borderRadius: 4, mb: 6 }}>
      <CardContent>
        {/* TITLE */}
        <Typography fontWeight={800} fontSize="1.1rem" mb={1}>
          {t(
            "components.Home.ProgressChart.your_progress",
            "Your Learning Progress"
          )}
        </Typography>

        {/* ✅ TREND */}
        <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
          Trend: {getTrend()}
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              {/* ✅ Gradient */}
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />

              {/* ✅ AREA LINE */}
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                fill="url(#colorScore)"
                strokeWidth={3}
              />

              {/* ✅ BEST SCORE POINT */}
              {bestPoint && (
                <ReferenceDot
                  x={bestPoint.week}
                  y={bestPoint.score}
                  r={6}
                  fill="green"
                  stroke="#fff"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
