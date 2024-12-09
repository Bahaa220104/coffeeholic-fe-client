import {
  Box,
  Button,
  Grid2,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { StaticDatePicker, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import { MAX_WIDTH } from "../consts";
import useApi from "../utils/useApi.hook";
import useCurrentBreakpoint from "../utils/useCurrentBreakpoint.hook";
import useWidthObserver from "../utils/useWidthObserver.hook";
import { useAuth } from "../contexts/auth.context";

function calculateTotalGridSize(items) {
  let maxWidth = 0;
  let maxHeight = 0;

  for (const item of items) {
    const itemRight = item.x + item.w; // far right edge of the item
    const itemBottom = item.y + item.h; // bottom edge of the item

    if (itemRight > maxWidth) {
      maxWidth = itemRight;
    }
    if (itemBottom > maxHeight) {
      maxHeight = itemBottom;
    }
  }

  return { width: maxWidth, height: maxHeight };
}

export default function Reservations() {
  const [activeStep, setActiveStep] = useState(0);
  const [ref, width] = useWidthObserver();
  const [data, setData] = useState({
    table: null,
    date: dayjs(new Date()),
    time: dayjs(new Date()),
  });
  const auth = useAuth();

  const api = useApi({ url: "/tables", method: "get", callOnMount: true });
  const reservationApi = useApi({ url: "/reservations", method: "post" });

  const tables = api.data?.length
    ? api.data.map((v) => {
        return { ...v, i: "" + v.id, static: true };
      })
    : [];

  const breakpoints = useCurrentBreakpoint();
  const small = breakpoints === "xs";

  const totalWidth = width;
  const margin = [10, 10];

  const gridSize = calculateTotalGridSize(tables);

  return (
    <Box
      sx={{
        width: "calc(100% - 64px)",
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        px: 2,
        py: 4,
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
      ref={ref}
    >
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "2.5rem", sm: "3rem" } }}
        fontWeight={700}
        mb={3}
      >
        Reserve Table
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>{small ? "" : "Choose Table"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Choose Date & Time"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Confirm"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Complete"}</StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <Box>
          <Typography variant="h5" mb={2}>
            Select a table
          </Typography>
          {data.table && (
            <>
              {" "}
              <Typography variant="h6" mb={-2}>
                Table {data.table.number}
              </Typography>
              <Typography variant="body1" mb={2}>
                <br />
                Seats: {data.table.seats}
                <br />
                Description: {data.table.description}
              </Typography>
            </>
          )}
          <GridLayout
            className="layout"
            layout={tables}
            cols={gridSize.width}
            rowHeight={
              (totalWidth - (gridSize.width - 1) * margin[0]) / gridSize.width
            }
            width={totalWidth}
            margin={margin}
            style={{
              border: "1px solid",
              borderColor: "rgba( 0, 0, 0, 0.12)",
              borderRadius: "18px",
              width: totalWidth,
              margin: "0 auto",
            }}
          >
            {tables?.map((table) => {
              return (
                <Box key={table.i} sx={{}}>
                  <Button
                    onClick={() => {
                      setData({ ...data, table: table });
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "divider",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      ...(data.table?.i === table.i
                        ? { borderColor: "primary", border: "2px solid" }
                        : {}),
                    }}
                  >
                    <Typography>{table.number}</Typography>
                  </Button>
                </Box>
              );
            })}
          </GridLayout>
        </Box>
      )}
      {activeStep === 1 && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid2 container spacing={3}>
            <Grid2 item size={12}>
              <Typography variant="body1">Select date & time</Typography>
            </Grid2>
            <Grid2 item size={{ md: 6, xs: 12 }}>
              <StaticDatePicker
                label="Date"
                sx={{ width: "100%" }}
                value={data.date}
                defaultValue={dayjs(new Date())}
                onChange={(newValue) => {
                  setData({ ...data, date: newValue });
                }}
                slotProps={{
                  actionBar: {
                    actions: [],
                  },
                }}
              />
            </Grid2>
            <Grid2 item size={{ md: 6, xs: 12 }}>
              <StaticTimePicker
                label="Time"
                sx={{ width: "100%" }}
                value={data.time}
                defaultValue={dayjs(new Date())}
                onChange={(newValue) => {
                  setData({ ...data, time: newValue });
                }}
                slotProps={{
                  actionBar: {
                    actions: [],
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </LocalizationProvider>
      )}
      {activeStep === 2 && (
        <Grid2 container spacing={2}>
          <Grid2 item size={12}>
            <Typography variant="h5" mb={1}>
              Table {data.table.number}
            </Typography>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1" mb={2}>
              {data.table.description}
            </Typography>
            <Typography variant="h6">Number of seats</Typography>
            <Typography variant="body1" mb={2}>
              {data.table.seats}
            </Typography>
          </Grid2>
          <Grid2 item xs={12}>
            <Typography variant="h5" mb={1}>
              Date & Time
            </Typography>
            <Typography variant="h6">Date</Typography>
            <Typography variant="body1" mb={2}>
              {data.date.format("MMMM D, YYYY")}
            </Typography>
            <Typography variant="h6">Time</Typography>
            <Typography variant="body1" mb={3}>
              {data.time.format("HH:mm:ss")}
            </Typography>
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              size="small"
              label="Remarks"
              fullWidth
              multiline
              rows={3}
              value={data.remarks || ""}
              onChange={(e) => {
                setData({ ...data, remarks: e.target.value });
              }}
            />
          </Grid2>
        </Grid2>
      )}
      {activeStep === 3 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "500px",
            alignItems: "center",
          }}
        >
          <Typography>
            Reservation made successfully. We are wating for you!
          </Typography>
        </Box>
      )}

      {auth.user && activeStep !== 3 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          {activeStep != 0 ? (
            <Button
              onClick={() => {
                setActiveStep(activeStep - 1);
              }}
            >
              Back
            </Button>
          ) : (
            <Box />
          )}
          <Tooltip
            title={
              activeStep === 0 && !data.table ? "Select a table to proceed" : ""
            }
          >
            <Box>
              <Button
                variant="contained"
                disabled={activeStep === 0 && !data.table}
                onClick={async () => {
                  if (activeStep === 2) {
                    const response = await reservationApi.call({
                      method: "post",
                      data: {
                        ...data,
                        content: data.table,
                      },
                    });

                    console.log("RES: ", {
                      ...data,
                      content: data.table,
                      date: data.date.$d,
                      time: data.time.$t,
                    });
                    if (response.ok) {
                    } else {
                      return;
                    }
                  }

                  setActiveStep(activeStep + 1);
                }}
              >
                {activeStep !== 2 ? "Continue" : "Confirm"}
              </Button>
            </Box>
          </Tooltip>
        </Box>
      )}

      {!auth.user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Box />
          <Button variant="contained" onClick={auth.openSignIn}>
            Sign in to continue
          </Button>
        </Box>
      )}
    </Box>
  );
}
