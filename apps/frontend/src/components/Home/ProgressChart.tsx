import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';

// ✅ TEMP mock data
const progressData = [
  { attempt: 'Quiz 1', score: 40 },
  { attempt: 'Quiz 2', score: 60 },
  { attempt: 'Quiz 3', score: 75 },
  { attempt: 'Quiz 4', score: 85 },
];

export default function ProgressChart() {
  return (
    <Card sx={{ borderRadius: 4, mb: 6 }}>
      <CardContent>
        <Typography
          fontWeight={800}
          fontSize="1.1rem"
          mb={2}
        >
          Your Learning Progress
        </Typography>

        <Box sx={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2196F3"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}