import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { MAX_WIDTH } from "../consts";
import useApi from "../utils/useApi.hook";

function formatTime(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Date(date).toLocaleString("en-US", options);
}

export default function MyOrders() {
  const api = useApi({ url: "/orders", method: "get", callOnMount: true });

  const rows = api.data?.length ? api.data : [];
  console.log("rows: ", rows);

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
        My Orders
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Order Items</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="center">Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>
                  {row?.content?.cart
                    ?.map((item) => {
                      return item?.product?.name;
                    })
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {row.type[0].toUpperCase() +
                    row.type.slice(1, row.type.length)}
                </TableCell>
                <TableCell>
                  {row.time ? formatTime(row.time) : formatTime(row.createdAt)}
                </TableCell>
                <TableCell>{row.content.total.toLocaleString()} LBP</TableCell>
                <TableCell align="center">
                  {row.completedAt ? (
                    <>
                      {!row.review ? (
                        <ReviewDialog orderId={row.id} refresh={api.call} />
                      ) : (
                        <Rating
                          name="read-only"
                          value={row.review.rating}
                          precision={0.5}
                          readOnly
                        />
                      )}
                    </>
                  ) : (
                    "Not yet complete"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ReviewDialog({ orderId, refresh }) {
  const [review, setReview] = useState({ rating: 0, remarks: "" });
  const [open, setOpen] = useState(false);

  const api = useApi({ url: "/reviews", method: "post" });

  async function handleSubmit() {
    const response = await api.call({ data: { ...review, orderId } });
    if (response.ok) {
      await refresh();
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="contained" size="small" onClick={() => setOpen(true)}>
        Write Review
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DialogTitle>Write a Review</DialogTitle>{" "}
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography component="legend" mb={-1}>
            How was your meal, on a scale of 1 to 5 ?
          </Typography>
          <Rating
            precision={0.5}
            value={review.rating}
            onChange={(event, newValue) => {
              setReview({ ...review, rating: newValue });
            }}
            required
          />
          <Typography component="legend" mb={-1} mt={1}>
            Any other remarks?
          </Typography>
          <TextField
            multiline
            rows={4}
            label="Remarks"
            fullWidth
            value={review.remarks}
            onChange={(event) => {
              setReview({ ...review, remarks: event.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" type="submit">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
