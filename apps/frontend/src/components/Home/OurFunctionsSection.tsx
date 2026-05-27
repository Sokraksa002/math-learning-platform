import { Box, Container, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { MenuBook, Edit, Image, School, AutoStories } from '@mui/icons-material';
import { useLocale } from '../../hooks/useLocale';
import { useNavigate } from 'react-router-dom';

export default function OurFunctionsSection() {
  const { t } = useLocale();

  const navigate = useNavigate();

  const features = [
    {
      title: t('nav.chapter', 'Chapter'),
      titleKhmer: t('chapter.khmer', 'ជំពូក'),
      description: t(
        'components.Home.OurFunctionsSection.chapter_desc',
        'រៀនមេរៀនរៀងរាប់ដែលផ្សំឡើងដោយស្ថាប័នអប់រំ'
      ),
      icon: MenuBook,
      bgColor: '#DBEAFE',
      iconColor: '#0284C7',
      path: '/chapter',
    },
    {
      title: t('nav.quiz', 'Quiz Practice'),
      titleKhmer: t('quiz.khmer', 'ធ្វើតេស្ត'),
      description: t(
        'components.Home.OurFunctionsSection.quiz_desc',
        'ហាត់សំណួរ និងបង្កើនចំណេះដឹងគណិតវិទ្យា'
      ),
      icon: Edit,
      bgColor: '#E0E7FF',
      iconColor: '#6366F1',
      path: '/quiz',
    },
    {
      title: t('flashcard.flashcardQA', 'Flashcard'),
      titleKhmer: t('flashcard.khmer', 'កាតបង្រៀន'),
      description: t(
        'components.Home.OurFunctionsSection.flashcard_desc',
        'ស្វែងរករូបមន្ត មេរៀន និងឯកសារសិក្សា'
      ),
      icon: AutoStories,
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
      path: '/flashcard',
    },
    {
      title: t('focus.title', 'Focus Timer'),
      titleKhmer: t('focus.khmer', 'ផ្តោតលើគោលដៅ'),
      description: t(
        'components.Home.OurFunctionsSection.focus_desc',
        'ផ្តោតលើការរៀនដោយលម្អិតក្នុងរយៈពេលសមស្របក'
      ),
      icon: School,
      bgColor: '#F3E8FF',
      iconColor: '#9333EA',
      path: '/focus',
    },
    {
      title: t('certificate.title', 'Certificate'),
      titleKhmer: t('certificate.khmer', 'វិក័យប័ត្រ'),
      description: t(
        'components.Home.OurFunctionsSection.certificate_desc',
        'ទទួលបានវិក័យប័ត្របង្ហាញការបញ្ចប់ដ៏ល្អឥតខ្ចោះ'
      ),
      icon: Image,
      bgColor: '#FECACA',
      iconColor: '#DC2626',
      path: '/certificate',
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#fff', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1f2937',
            mb: 1,
            textAlign: 'center',
            fontSize: { xs: '28px', md: '36px' },
          }}
        >
          {t('components.Home.OurFunctionsSection.our_functions', 'Our Features')}
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: '#6b7280',
            mb: 6,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          {t(
            'components.Home.OurFunctionsSection.features_intro',
            'ឧបករណ៍សិក្សាដ៏ឆ្នើមសម្រាប់ភាពជោគជ័យ'
          )}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardActionArea onClick={() => feature.path && navigate(feature.path)}>
                <Box
                  sx={{
                    backgroundColor: feature.bgColor,
                    py: 3,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <feature.icon sx={{ fontSize: 32, color: feature.iconColor }} />
                  </Box>
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1f2937',
                      mb: 0.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#3B82F6',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {feature.titleKhmer}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      lineHeight: 1.6,
                      fontSize: '14px',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}