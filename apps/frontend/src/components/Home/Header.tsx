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
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import React, { useState } from "react";
import {
  AccountCircle,
  School,
  Quiz,
  Style,
  Psychology,
  Menu as MenuIcon,
  Home,
} from "@mui/icons-material";

import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { useLocale } from "../../hooks/useLocale";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, setLocale, t } = useLocale();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => setAnchorEl(null);

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
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

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { label: t("nav.home", "Home"), path: "/home", icon: <Home /> },
    { label: t("nav.chapter", "Chapter"), path: "/chapter", icon: <School /> },
    { label: t("nav.quiz", "Quiz"), path: "/quiz", icon: <Quiz /> },
    { label: t("nav.flashcard", "Flashcard"), path: "/flashcard", icon: <Style /> },
    { label: t("menu.about", "About us"), path: "/about", icon: <School /> },
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
            
<Toolbar
  sx={{
    justifyContent: 'space-between',
    px: { xs: 2, sm: 4 },
    minHeight: 88,     // ✅ KEY LINE (default is 56)
    alignItems: 'center',
  }}
>

        {/* Logo */}
        <Box
          component={Link}
          to="/home"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img src={logo} alt="Kanit logo" style={{ height: 76, display: 'block' }} />
        </Box>
          {/* ================= DESKTOP MENU ================= */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1.5,
              alignItems: "center",
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => go(item.path)}
                sx={navBtn(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* ================= RIGHT SIDE ================= */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Locale */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              <Button
                size="small"
                variant={locale === "en" ? "contained" : "outlined"}
                onClick={() => setLocale("en")}
                sx={{ textTransform: "none" }}
              >
                EN
              </Button>
              <Button
                size="small"
                variant={locale === "km" ? "contained" : "outlined"}
                onClick={() => setLocale("km")}
                sx={{ textTransform: "none" }}
              >
                ខ្មែរ
              </Button>
            </Box>

            {/* Profile */}
            <IconButton onClick={handleProfileOpen} sx={{ color: "#333" }}>
              <AccountCircle />
            </IconButton>

            {/* MOBILE MENU BUTTON */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 260, p: 2 }}>
          <Typography fontWeight={700} mb={2}>
            Menu
          </Typography>

          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => go(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Locale inside mobile */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              fullWidth
              variant={locale === "en" ? "contained" : "outlined"}
              onClick={() => setLocale("en")}
            >
              EN
            </Button>
            <Button
              fullWidth
              variant={locale === "km" ? "contained" : "outlined"}
              onClick={() => setLocale("km")}
            >
              KH
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* ================= PROFILE MENU ================= */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileClose}
      >
        <MenuItem onClick={() => { navigate("/profile"); handleProfileClose(); }}>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          My profile
        </MenuItem>

        <MenuItem onClick={() => { navigate("/quiz-history"); handleProfileClose(); }}>
          <ListItemIcon><Quiz /></ListItemIcon>
          My quiz attempts
        </MenuItem>

        <MenuItem onClick={() => { navigate("/flashcard-history"); handleProfileClose(); }}>
          <ListItemIcon><Style /></ListItemIcon>
          Flashcard history
        </MenuItem>

        <MenuItem onClick={() => { navigate("/ability"); handleProfileClose(); }}>
          <ListItemIcon><Psychology /></ListItemIcon>
          My ability
        </MenuItem>
      </Menu>
    </>
  );
}