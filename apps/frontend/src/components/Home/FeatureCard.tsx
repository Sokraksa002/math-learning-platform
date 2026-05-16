import { Box, Typography } from '@mui/material';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  bgColor: string;
  iconBg: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  bgColor,
  iconBg,
}: FeatureCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        p: 4,                     // ✅ more breathing room
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon sx={{ color: '#fff' }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 1.5, color: '#000' }}
      >
        {title}
      </Typography>

      {/* Divider */}
      <Box
        sx={{
          width: 32,
          height: 2,
          backgroundColor: iconBg,
          mb: 2.5,
        }}
      />

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.7,
          color: 'text.secondary',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}