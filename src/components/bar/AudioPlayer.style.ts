import { styled } from "@mui/system";
import { IconButton, Typography } from "@mui/material";

export const PlayButton = styled(IconButton)(({ theme }) => ({
  margin: "0 0.5em",
}));

export const BarMain = styled("main")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});
