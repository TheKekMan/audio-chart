import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import PaletteIcon from "@mui/icons-material/Palette";
import { TransitionProps } from "@mui/material/transitions";
import { VisualizerSettings } from "../../pages/App";
import {
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { LoopLabel, SettingsInput } from "./SettingsDialog.style";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import gradient from "chartjs-plugin-gradient";
import { ColorPicker, toColor, useColor } from "react-color-palette";
require("react-color-palette/lib/css/styles.css");
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hook, setHook] = useState<string>();
  const [color, setColor] = useColor("hex", "#121212");
  const [innerSettings, setInnerSettings] =
    useState<VisualizerSettings>(settings);

  const handlePickerClose = () => {
    setPickerOpen(false);
    setHook("");
  };

  const handleClickOpen = (field: string) => {
    setHook(field);
    const color = toColor("hex", innerSettings[field]);
    setColor(color);
    setPickerOpen(true);
  };

  const PickerAdornment = ({ field }: { field: string }) => {
    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle picker"
          onClick={() => handleClickOpen(field)}
          edge="end"
        >
          <PaletteIcon />
        </IconButton>
      </InputAdornment>
    );
  };

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
      fps: Yup.number()
        .typeError("Only numbers")
        .required("Required field")
        .min(1, "Too small")
        .max(240, "Ultra PC configuration is required"),
      floating: Yup.boolean().required(),
    }),
    onSubmit: () => {
      setSettings(innerSettings);
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
        max: formik.values.floating ? 150 : 300,
        min: formik.values.floating ? -150 : 0,
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
  const musicArray = Array.from({ length: innerSettings.fftSize / 4 }, () =>
    Math.floor(Math.random() * 300)
  ).sort((a, b) => b - a);
  const emptyArray = new Array(innerSettings.fftSize / 4);
  const labels = emptyArray.fill(" ", 0, innerSettings.fftSize / 4);
  console.log(formik.values);
  const data = {
    labels,
    datasets: [
      {
        data:
          musicArray && formik.values.floating
            ? musicArray.map((data) => {
                return [-data * 0.5, data * 0.5];
              })
            : musicArray,
        fill: 1,
        borderRadius: formik.values.floating ? Number.MAX_VALUE : 0,
        borderSkipped: false,
        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: innerSettings.h0,
              50: innerSettings.h50,
              100: innerSettings.h100,
              150: innerSettings.h150,
              200: innerSettings.h200,
              250: innerSettings.h250,
            },
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (formik.isValid) {
      setInnerSettings(formik.values);
    }
  }, [
    formik.isValid,
    formik.values.loop,
    formik.values.fps,
    formik.values.floating,
  ]);

  useEffect(() => {
    if (hook) {
      formik.setFieldValue(hook, color.hex, true);
      console.log(formik.values);
      setInnerSettings(formik.values);
    }
  }, [color]);

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
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h0"} />,
                    }}
                  />
                  <SettingsInput
                    name="h50"
                    label="50-100"
                    value={formik.values.h50}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h50}
                    helperText={formik.errors.h50 ? formik.errors.h50 : null}
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h50"} />,
                    }}
                  />
                  <SettingsInput
                    name="h100"
                    label="100-150"
                    value={formik.values.h100}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h100}
                    helperText={formik.errors.h100 ? formik.errors.h100 : null}
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h100"} />,
                    }}
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
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h150"} />,
                    }}
                  />
                  <SettingsInput
                    name="h200"
                    label="200-250"
                    value={formik.values.h200}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h200}
                    helperText={formik.errors.h200 ? formik.errors.h200 : null}
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h200"} />,
                    }}
                  />
                  <SettingsInput
                    name="h250"
                    label="250+"
                    value={formik.values.h250}
                    onChange={formik.handleChange}
                    error={!!formik.errors.h250}
                    helperText={formik.errors.h250 ? formik.errors.h250 : null}
                    InputProps={{
                      endAdornment: <PickerAdornment field={"h250"} />,
                    }}
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
                <SettingsInput
                  name="fps"
                  label="FPS"
                  value={formik.values.fps}
                  onChange={formik.handleChange}
                  error={!!formik.errors.fps}
                  helperText={formik.errors.fps ? formik.errors.fps : null}
                />
                <LoopLabel
                  checked={formik.values.loop}
                  control={
                    <Checkbox onChange={formik.handleChange} name="loop" />
                  }
                  label="Loop"
                />
                <LoopLabel
                  control={
                    <Checkbox
                      checked={formik.values.floating}
                      onChange={formik.handleChange}
                      name="floating"
                    />
                  }
                  label="Floating"
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
            <Button
              onClick={() => {
                handleClose();
                setInnerSettings(settings);
                formik.resetForm();
              }}
              color={"error"}
            >
              Cancel
            </Button>
            <Button type={"submit"}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={pickerOpen}
        onClose={handlePickerClose}
        TransitionComponent={Transition}
      >
        <ColorPicker
          width={456}
          height={228}
          color={color}
          onChange={setColor}
          hideHSV
          hideRGB
          dark
        />
        <Button variant="text" onClick={handlePickerClose}>
          Set Color
        </Button>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
