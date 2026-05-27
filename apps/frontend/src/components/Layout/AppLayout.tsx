import { useState, type ReactNode, type ElementType } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";

import {
  Home,
  BookOpen,
  BarChart3,
  Edit3,
  LogOut,
  Users,
  BadgeCheck,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { useLocale } from "../../hooks/useLocale";

type NavigationItem = {
  icon: ElementType;
  label: string;
  path: string;
};

export const AppLayout = ({
  children,
  isLoggedIn,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { t, locale, setLocale } = useLocale();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  // ✅ FIXED: USE nav.xxx KEYS
  const navigationItems: NavigationItem[] = isAdmin
    ? [
        { icon: BarChart3, label: "Admin", path: "/admin" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: Edit3, label: "Quizzes", path: "/admin/quizzes" },
        { icon: BookOpen, label: "Lessons", path: "/admin/lessons" },
        { icon: BadgeCheck, label: "Certificates", path: "/admin/certificates" },
      ]
    : [
        { icon: Home, label: t("nav.home"), path: "/" },
        { icon: BookOpen, label: t("nav.chapter"), path: "/chapter" },
        { icon: Edit3, label: t("nav.quiz"), path: "/quiz" },

        { icon: BookOpen, label: t("nav.flashcard"), path: "/flashcard" },
        { icon: BarChart3, label: t("nav.ability"), path: "/ability" },
        { icon: BadgeCheck, label: t("nav.certificate"), path: "/certificate" },
        { icon: BookOpen, label: t("nav.history"), path: "/quiz-history" },
      ];

  const drawerWidth = sidebarExpanded ? 200 : 70;

  const handleLogout = () => {
    localStorage.removeItem("mlp_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const sidebar = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #1E40AF, #1E3A8A)",
        color: "white",
        px: 1,
        pt: 1.5,
      }}
    >
      {/* LOGO */}
      <Box
        onClick={() => navigate("/")}
        sx={{ textAlign: "center", mb: 2, cursor: "pointer" }}
      >
        📐
        {sidebarExpanded && <Typography>Kanit</Typography>}
      </Box>

      <Divider sx={{ background: "rgba(255,255,255,0.2)" }} />

      {/* MENU */}
      <List sx={{ flex: 1 }}>
        {navigationItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={i} title={!sidebarExpanded ? item.label : ""}>
              <ListItem
                button
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  justifyContent: sidebarExpanded
                    ? "flex-start"
                    : "center",
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 30 }}>
                  <Icon size={17} />
                </ListItemIcon>

                {sidebarExpanded && (
                  <ListItemText primary={item.label} />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ background: "rgba(255,255,255,0.2)" }} />

      {/* ✅ LANGUAGE SWITCH */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Button
          size="small"
          onClick={() => setLocale("en")}
          sx={{
            color: locale === "en" ? "#fff" : "#ccc",
            fontWeight: locale === "en" ? "bold" : "normal",
          }}
        >
          EN
        </Button>

        |

        <Button
          size="small"
          onClick={() => setLocale("km")}
          sx={{
            color: locale === "km" ? "#fff" : "#ccc",
            fontWeight: locale === "km" ? "bold" : "normal",
          }}
        >
          KM
        </Button>
      </Box>

      {/* LOGIN / LOGOUT */}
      <Box>
        {isLoggedIn ? (
          <Button onClick={handleLogout} fullWidth sx={{ color: "white" }}>
            <LogOut size={17} />
            {sidebarExpanded && <Box ml={1}>{t("nav.logout")}</Box>}
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate("/login")} fullWidth sx={{ color: "white" }}>
              {t("nav.login")}
            </Button>

            <Button onClick={() => navigate("/register")} fullWidth sx={{ color: "white" }}>
              {t("nav.register")}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {!isMobile && (
        <Box
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          sx={{
            width: drawerWidth,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1000,
          }}
        >
          {sidebar}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          ml: !isMobile ? `${drawerWidth}px` : 0,
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
