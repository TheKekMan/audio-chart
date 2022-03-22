import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { VisualizerSettings } from "../../App";
import { Checkbox, FormControl, Stack } from "@mui/material";
import { LoopLabel, SettingsInput } from "./SettingsDialog.style";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import gradient from "chartjs-plugin-gradient";
Chart.register(CategoryScale);
Chart.register(gradient);

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
      h0: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      h50: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      h100: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      h150: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      h200: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      h250: Yup.string()
        .required("Required field")
        .matches(/^#([0-9a-f]{3}){1,2}$/i, "incorrect hex"),
      fftSize: Yup.number()
        .required("Required field")
        .typeError("A number is required")
        .min(16, "Too small")
        .max(8192, "Too much big, r u sure?")
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
      handleClose();
    },
  });

  const options = {
    animation: {
      duration: 100,
    },
    easing: "linear",
    responsive: true,
    scales: {
      x: {
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        max: 300,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  const musicArray = Array.from({ length: settings.fftSize / 4 }, () =>
    Math.floor(Math.random() * 300)
  ).sort((a, b) => b - a);
  const emptyArray = new Array(settings.fftSize / 4);
  const labels = emptyArray.fill(" ", 0, settings.fftSize / 4);
  const data = {
    labels,
    datasets: [
      {
        data: musicArray,
        fill: 1,
        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: settings.h0,
              50: settings.h50,
              100: settings.h100,
              150: settings.h150,
              200: settings.h200,
              250: settings.h250,
            },
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (formik.isValid) {
      setSettings(formik.values);
    }
  }, [formik.isValid]);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Chart settings for audio visualizer"}</DialogTitle>
          <FormControl>
            <DialogContent>
              <Stack direction={"row"} sx={{ marginTop: "1em", gap: "1em" }}>
                <Stack direction={"column"} spacing={2}>
                  <SettingsInput
                    name="h0"
                    label="0-50"
                    value={formik.values.h0}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h0}
                    helperText={formik.errors.h0 ? formik.errors.h0 : null}
                  />
                  <SettingsInput
                    name="h50"
                    label="50-100"
                    value={formik.values.h50}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h50}
                    helperText={formik.errors.h50 ? formik.errors.h50 : null}
                  />
                  <SettingsInput
                    name="h100"
                    label="100-150"
                    value={formik.values.h100}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h100}
                    helperText={formik.errors.h100 ? formik.errors.h100 : null}
                  />
                </Stack>
                <Stack direction={"column"} spacing={2}>
                  <SettingsInput
                    name="h150"
                    label="150-200"
                    value={formik.values.h150}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h150}
                    helperText={formik.errors.h150 ? formik.errors.h150 : null}
                  />
                  <SettingsInput
                    name="h200"
                    label="200-250"
                    value={formik.values.h200}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h200}
                    helperText={formik.errors.h200 ? formik.errors.h200 : null}
                  />
                  <SettingsInput
                    name="h250"
                    label="250+"
                    value={formik.values.h250}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h250}
                    helperText={formik.errors.h250 ? formik.errors.h250 : null}
                  />
                </Stack>
              </Stack>
              <Stack direction={"row"} sx={{ marginTop: "1em", gap: "1em" }}>
                <SettingsInput
                  name="fftSize"
                  label="fftSize"
                  value={formik.values.fftSize}
                  onChange={formik.handleChange}
                  error={!!formik.errors.fftSize}
                  helperText={
                    formik.errors.fftSize ? formik.errors.fftSize : null
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
          </FormControl>
          <Bar
            style={{ maxHeight: "100%", maxWidth: "100%", padding: "0 2em" }}
            data={data}
            options={options}
          />
          <DialogActions>
            <Button onClick={handleClose} color={"error"}>
              Cancel
            </Button>
            <Button type={"submit"}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
