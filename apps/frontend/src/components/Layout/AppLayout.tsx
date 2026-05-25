import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Home,
  BookOpen,
  BarChart3,
  Edit3,
  Award,
  Calendar,
  Settings,
  LogOut,
  Menu as MenuIcon,
  Flag,
  Users,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { useLocale } from "../../hooks/useLocale";
import { Psychology } from "@mui/icons-material";
import { useAuthModal } from "../../contexts/AuthModalContext";

export const AppLayout = ({ children, isLoggedIn }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { locale, setLocale } = useLocale();

  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";
  const { openLogin } = useAuthModal();

  const navigationItems = isLoggedIn
    ? isAdmin
      ? [
          { icon: BarChart3, label: "Admin", path: "/admin" },
          { icon: Users, label: "Users", path: "/admin/users" },
          { icon: Edit3, label: "Quizzes", path: "/admin/quizzes" },
          { icon: BookOpen, label: "Lessons", path: "/admin/lessons" },
          { icon: BadgeCheck, label: "Certificates", path: "/admin/certificates" },
          { icon: Home, label: "Home", path: "/" },
        ]
      : [
          { icon: Home, label: "Home", path: "/home" },
          { icon: BookOpen, label: "Chapters", path: "/chapter" },
          { icon: BarChart3, label: "Progress", path: "/dashboard" },
          { icon: Edit3, label: "Quizzes", path: "/quiz" },
          { icon: Award, label: "Certificates", path: "/certificate" },
          { icon: Calendar, label: "Calendar", path: "/focus" },
          { icon: Flag, label: "Flashcards", path: "/flashcard" },
          { icon: Psychology, label: "Ability", path: "/ability" },
        ]
    : [];

  /* ✅ Smaller widths */
  const drawerWidth = sidebarExpanded ? 200 : 70;

  const sidebar = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(180deg, #1E40AF, #1E3A8A)",
        color: "white",
        px: 1,
        pt: 1.5,
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarExpanded ? "flex-start" : "center",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          📐
        </Box>

        {sidebarExpanded && (
          <Typography sx={{ ml: 1, fontWeight: 600, fontSize: 15 }}>
            Kanit
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 0.8, background: "rgba(255,255,255,0.2)" }} />

      {/* MENU */}
      <List sx={{ flex: 1 }}>
        {navigationItems.map((item: any, i: number) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={i} title={!sidebarExpanded ? item.label : ""}>
              <ListItem
                button
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 0.2,
                  borderRadius: 2,
                  px: 1,
                  py: 0.6,
                  justifyContent: sidebarExpanded ? "flex-start" : "center",

                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",

                  "&:hover": {
                    background: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: 30,
                    justifyContent: "center",
                  }}
                >
                  <Icon size={17} />
                </ListItemIcon>

                {sidebarExpanded && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      ml: 0.5,
                      "& .MuiListItemText-primary": {
                        fontSize: 13,
                      },
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ my: 0.8, background: "rgba(255,255,255,0.2)" }} />

      {/* FOOTER */}
      {isLoggedIn && (
        <Box>
          <ListItem
            button
            onClick={() => setLocale(locale === "en" ? "km" : "en")}
            sx={{
              borderRadius: 2,
              px: 1,
              py: 0.6,
              justifyContent: sidebarExpanded ? "flex-start" : "center",
              mb: 0.6,
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 30, justifyContent: "center" }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                {locale === "en" ? "KH" : "EN"}
              </Typography>
            </ListItemIcon>

            {sidebarExpanded && (
              <ListItemText
                primary={locale === "en" ? "ខ្មែរ" : "English"}
                sx={{ ml: 0.5, "& .MuiListItemText-primary": { fontSize: 13 } }}
              />
            )}
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/profile")}
            sx={{
              borderRadius: 2,
              px: 1,
              py: 0.6,
              justifyContent: sidebarExpanded ? "flex-start" : "center",
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 30 }}>
              <Settings size={17} />
            </ListItemIcon>

            {sidebarExpanded && (
              <ListItemText
                primary="Settings"
                sx={{ "& .MuiListItemText-primary": { fontSize: 13 } }}
              />
            )}
          </ListItem>

          <Button
            fullWidth
            onClick={() => openLogin()}
            sx={{
              mt: 0.6,
              px: 1,
              py: 0.6,
              fontSize: 13,
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              justifyContent: sidebarExpanded ? "flex-start" : "center",
            }}
          >
            <LogOut size={17} />
            {sidebarExpanded && <Box ml={0.5}>Logout</Box>}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* MOBILE */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* DESKTOP */}
      {!isMobile && (
        <Box
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          sx={{
            width: drawerWidth,
            transition: "width 0.2s ease",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
          }}
        >
          {sidebar}
        </Box>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sidebar}
        </Drawer>
      )}
      
      <Box
  sx={{
    flex: 1,
    ml: !isMobile ? `${drawerWidth}px` : 0,
    transition: "margin 0.2s ease",
    overflowY: "auto",
    height: "100vh",
    background: "#f5f7fc",
    p: 3,   // ✅ important: padding
  }}
>

      {children}
      </Box>
      </Box>
  );
};