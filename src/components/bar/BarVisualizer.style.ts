import { styled } from "@mui/system";
import { Button, IconButton } from "@mui/material";

export const PlayButton = styled(Button)(({ theme }) => ({
  padding: ".5em .8em",
  margin: "0 1em",
}));

export const BarMain = styled("main")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));
