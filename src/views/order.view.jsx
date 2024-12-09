import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { MAX_WIDTH } from "../consts";
import Order from "./components/order.component";
import { useCart } from "../contexts/cart.context";
import useApi from "../utils/useApi.hook";
import { useAuth } from "../contexts/auth.context";
import useCurrentBreakpoint from "../utils/useCurrentBreakpoint.hook";

export default function MyOrder() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState({ type: "delivery", paymentMethod: "cod" });
  const cart = useCart();
  const order = cart.cart;
  const breakpoints = useCurrentBreakpoint();
  const small = breakpoints === "xs";

  const api = useApi({ url: "/orders", method: "post" });
  const auth = useAuth();

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
      component="form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (activeStep === 2) {
          const response = await api.call({
            data: { ...data, content: cart },
          });
          if (!response.ok) {
            return;
          } else {
            cart.reset();
          }
        }
        setActiveStep(activeStep + 1);
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "2.5rem", sm: "3rem" } }}
        fontWeight={700}
        mb={3}
      >
        My Order
      </Typography>
      <Stepper
        orientation={"horizontal"}
        activeStep={activeStep}
        sx={{ mb: 4 }}
      >
        <Step>
          <StepLabel>{small ? "" : "Confirm Order"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Take Away or Delivery"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Payment"}</StepLabel>
        </Step>

        <Step>
          <StepLabel>{small ? "" : "Complete"}</StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 && <Order order={order} />}

      {activeStep === 1 && (
        <Grid2 container spacing={2}>
          <Grid2 item size={12}>
            <FormControl>
              <FormLabel>Choose</FormLabel>
              <RadioGroup
                row
                value={data.type}
                onChange={(e) => {
                  setData({ ...data, type: e.target.value });
                }}
              >
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label="Delivery (+ 100,000 LBP)"
                />
                <FormControlLabel
                  value="take away"
                  control={<Radio />}
                  label="Take Away"
                />
              </RadioGroup>
            </FormControl>
          </Grid2>

          {data.type === "delivery" && (
            <>
              <Grid2 item size={6}>
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  value={data.city}
                  onChange={(e) => {
                    setData({ ...data, city: e.target.value });
                  }}
                  required
                />
              </Grid2>
              <Grid2 item size={6}>
                <TextField
                  size="small"
                  label="Building"
                  fullWidth
                  value={data.building}
                  onChange={(e) => {
                    setData({ ...data, building: e.target.value });
                  }}
                  required
                />
              </Grid2>
              <Grid2 item size={12}>
                <TextField
                  size="small"
                  label="Address"
                  fullWidth
                  multiline
                  rows={4}
                  value={data.address}
                  onChange={(e) => {
                    setData({ ...data, address: e.target.value });
                  }}
                  required
                />
              </Grid2>
            </>
          )}

          {data.type === "take away" && (
            <Grid2 item size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              </LocalizationProvider>
            </Grid2>
          )}
        </Grid2>
      )}

      {activeStep === 2 && (
        <Box>
          <Typography variant="h4">Payment</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Subtotal</Typography>
            <Typography variant="h6">
              {cart.subtotal?.toLocaleString()} LBP
            </Typography>
          </Box>
          {data.type === "delivery" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Delivery</Typography>
              <Typography variant="h6">100,000 LBP</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Other fees</Typography>
              <Typography variant="h6">0 LBP</Typography>
            </Box>
          )}
          <Divider />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">
              {(
                cart.subtotal + (data.type === "delivery" ? 100000 : 0)
              ).toLocaleString()}{" "}
              LBP
            </Typography>{" "}
          </Box>

          <FormControl sx={{ pt: 4 }}>
            <FormLabel>Payment Method</FormLabel>
            <RadioGroup
              row
              value={data.paymentMethod}
              onChange={(e) => {
                setData({ ...data, paymentMethod: e.target.value });
              }}
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash On Delivery"
              />
            </RadioGroup>
          </FormControl>
        </Box>
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
          <Typography>Your order is on the way!</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        {activeStep != 0 && activeStep != 3 ? (
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
        {auth.user && activeStep != 3 && (
          <Tooltip>
            <Box>
              <Button
                type="submit"
                disabled={activeStep === 0 && !cart.cart.length}
                variant="contained"
                onClick={async () => {}}
              >
                {activeStep !== 2 ? "Continue" : "Confirm"}
              </Button>
            </Box>
          </Tooltip>
        )}
        {!auth.user && (
          <Button variant="contained" onClick={auth.openSignIn}>
            Sign in to continue
          </Button>
        )}
      </Box>
    </Box>
  );
}
