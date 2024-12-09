import { Box, Typography } from "@mui/material";
import { MAX_WIDTH } from "../consts";

export default function ReservationsSucess() {
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
    >
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "2.5rem", sm: "3rem" } }}
        fontWeight={700}
        mb={3}
      >
        Reserve Table
      </Typography>

      <Box
        sx={{
          height: "500px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Reservation successful. We are waiting for you!</Typography>
      </Box>
    </Box>
  );
}
