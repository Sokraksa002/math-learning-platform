import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  iconBg: string;
}

export default function FeatureCard({
  title,
  description,
  icon: IconComponent,
  bgColor,
  iconBg,
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: bgColor,
        boxShadow: 'none',
        border: 'none',
        borderRadius: '8px',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: iconBg,
            borderRadius: '8px',
            mb: 2,
          }}
        >
          <IconComponent sx={{ color: '#fff', fontSize: '28px' }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 1,
            fontSize: '18px',
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: '30px',
            height: '2px',
            backgroundColor: iconBg,
            mb: 2,
          }}
        />

        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
