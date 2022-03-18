import React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { VisualizerSettings } from "../../App";
import { Checkbox, Stack, TextField } from "@mui/material";
import { LoopLabel, SettingsInput } from "./SettingsDialog.style";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useFormik } from "formik";
import * as Yup from "yup";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SettingsDialog = ({
  open,
  handleClose,
  setSettings,
  settings,
}: {
  open: boolean;
  handleClose: any;
  setSettings: any;
  settings: VisualizerSettings;
}) => {
  const formik = useFormik({
    initialValues: settings,
    validationSchema: Yup.object({
      fftSize: Yup.number()
        .required()
        .test("is-validate", "${path} incorrect, should be ^2", (value) => {
          if (value) {
            return (Math.log(value) / Math.log(2)) % 1 === 0;
          } else {
            return false;
          }
        }),
      loop: Yup.boolean().required(),
    }),
    onSubmit: (values) => {
      setSettings(values);
      console.log(values);
      handleClose();
    },
  });

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Chart settings for audio visualizer"}</DialogTitle>
        <DialogContent>
          <Stack direction={"row"} sx={{ marginTop: "1em", gap: "1em" }}>
            <Stack direction={"column"} spacing={2}>
              <SettingsInput
                name="h['0']"
                id={"1"}
                label="0-50"
                value={formik.values.h["0"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
              <SettingsInput
                name="h['50']"
                label="50-100"
                value={formik.values.h["50"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
              <SettingsInput
                name="h['100']"
                label="100-150"
                value={formik.values.h["100"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
            </Stack>
            <Stack direction={"column"} spacing={2}>
              <SettingsInput
                name="h['150']"
                label="150-200"
                value={formik.values.h["150"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
              <SettingsInput
                name="h['200']"
                label="200-250"
                value={formik.values.h["200"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
              <SettingsInput
                name="h['250']"
                label="250+"
                value={formik.values.h["250"]}
                onChange={formik.handleChange}
                error={!!(formik.touched.h && formik.errors.h)}
                helperText={
                  formik.touched.h && formik.errors.h ? formik.errors.h : null
                }
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "1em", gap: "1em" }}>
            <SettingsInput
              name="fftSize"
              label="fftSize"
              value={formik.values.fftSize}
              onChange={formik.handleChange}
              error={!!(formik.touched.fftSize && formik.errors.fftSize)}
              helperText={
                formik.touched.fftSize && formik.errors.fftSize
                  ? formik.errors.fftSize
                  : null
              }
            />
            <LoopLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={formik.handleChange}
                  name="loop"
                />
              }
              label="Loop"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={"error"}>
            Cancel
          </Button>
          <Button onClick={() => formik.handleSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
