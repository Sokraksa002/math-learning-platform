import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import React from "react";
import {
  AccountCircle,
  School,
  Quiz,
  Style,
  Psychology,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLocale } from "../../hooks/useLocale";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, setLocale, t } = useLocale();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const navBtn = (path: string) => ({
    color: "#333",
    fontWeight: 500,
    textTransform: "none",
    fontSize: 14,
    borderRadius: "12px",
    px: 2,
    backgroundColor: location.pathname.startsWith(path)
      ? "#E3F2FD"
      : "transparent",
    "&:hover": {
      backgroundColor: "#E3F2FD",
    },
  });

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        {/* Logo */}
        <Typography
          component={Link}
          to="/home"
          sx={{
            fontWeight: "bold",
            color: "#2196F3",
            fontSize: "24px",
            textDecoration: "none",
          }}
        >
          Kanit
        </Typography>

        {/* Main menu */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button onClick={() => navigate("/home")} sx={navBtn("/home")}>
            {t('nav.home', 'Home')}
          </Button>
          <Button onClick={() => navigate("/chapter")} sx={navBtn("/chapter")}>
            {t('nav.chapter', 'Chapter')}
          </Button>
          <Button onClick={() => navigate("/quiz")} sx={navBtn("/quiz")}>
            {t('nav.quiz', 'Quiz')}
          </Button>
          <Button
            onClick={() => navigate("/flashcard")}
            sx={navBtn("/flashcard")}
          >
            {t('nav.flashcard', 'Flashcard')}
          </Button>
          <Button sx={navBtn("/about")}>{t('menu.about', 'About us')}</Button>
        </Box>

        {/* Locale switch */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
          <Button
            size="small"
            variant={locale === 'en' ? 'contained' : 'outlined'}
            onClick={() => setLocale('en')}
            sx={{ textTransform: 'none' }}
          >
            EN
          </Button>
          <Button
            size="small"
            variant={locale === 'km' ? 'contained' : 'outlined'}
            onClick={() => setLocale('km')}
            sx={{ textTransform: 'none' }}
          >
            ខ្មែរ
          </Button>
        </Box>

        {/* Account icon */}
        <IconButton onClick={handleProfileOpen} sx={{ color: "#333" }}>
          <AccountCircle sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Profile dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              minWidth: 220,
              mt: 1,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            {t('menu.myProfile', 'My profile')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/chapter");
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <School fontSize="small" />
            </ListItemIcon>
            {t('menu.lesson', 'Lesson')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/quiz-history");
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Quiz fontSize="small" />
            </ListItemIcon>
            {t('nav.quizHistory', 'My quiz attempts')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/flashcard-history");
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Style fontSize="small" />
            </ListItemIcon>
            {t('nav.flashcardHistory', 'Flashcard history')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/ability");
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Psychology fontSize="small" />
            </ListItemIcon>
            {t('nav.ability', 'My Ability')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
