import { IconButton, styled } from "@mui/material";
import { Button, Typography } from "@mui/material";

export const AppMain = styled("div")(({ theme }) => ({
  textAlign: "center",
}));

export const AppHeader = styled(Typography)(({ theme }) => ({
  margin: ".5rem",
  fontSize: "3rem",
  color: theme.palette.primary.main,
}));

export const Input = styled("input")({
  display: "none",
});

export const AppButton = styled("span")(({ theme }) => ({
  borderRadius: "0.3rem",
  display: "inline-block",
  padding: "6px 12px",
  cursor: "pointer",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.dark,
}));

export const SettingsButton = styled(IconButton)(({ theme }) => ({
  margin: ".1em .3em",
}));
