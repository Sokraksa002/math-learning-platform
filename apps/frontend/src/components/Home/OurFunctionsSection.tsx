import { Box, Container, Typography } from '@mui/material';
import { MenuBook, Lock, AutoStories } from '@mui/icons-material';
import FeatureCard from './FeatureCard';

export default function OurFunctionsSection() {
  const features = [
    {
      title: 'Chapter',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: MenuBook,
      bgColor: '#C8E6C9',
      iconBg: '#81C784',
    },
    {
      title: 'Quiz',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: Lock,
      bgColor: '#B3E5FC',
      iconBg: '#4FC3F7',
    },
    {
      title: 'Flashcard Q&A',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: AutoStories,
      bgColor: '#FFF9C4',
      iconBg: '#FFD54F',
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#fafafa', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 5,
            fontSize: '28px',
          }}
        >
          Our Functions
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: 1, minWidth: 0 }}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                bgColor={feature.bgColor}
                iconBg={feature.iconBg}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
