import { styled, TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export const SettingsInput = styled(TextField)({
  ".MuiInputLabel-formControl": {
    backgroundColor: "#383838",
  },
  ".MuiInputBase-root": {
    backgroundColor: "#383838",
  },
});

export const LoopLabel = styled(FormControlLabel)({
  ".MuiTypography-body1": {
    backgroundColor: "#383838",
  },
});
