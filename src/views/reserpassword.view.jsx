import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useApi from "../utils/useApi.hook";
import { useNavigate, useParams } from "react-router";

export default function ResetPassword() {
  const params = useParams();
  const [data, setData] = useState({ password: "", repeatPassword: "" });
  const [error, setError] = useState("");
  const api = useApi({
    method: "post",
    url: "/auth/resetpassword/" + params.token,
  });
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        width: "calc(100% - 20px)",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
        component="form"
        onSubmit={async (e) => {
          e.preventDefault();

          const response = await api.call({
            data: { password: data.password },
          });

          if (response.ok) {
            localStorage.setItem("token", response.data.token);
            navigate("/");
            setError(null);
          } else {
            setError(response.error);
          }
        }}
      >
        <Typography variant="h6">Reset Password</Typography>
        <TextField
          required
          type="password"
          label="New Password"
          size="small"
          fullWidth
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <TextField
          required
          type="password"
          label="Repeat New Password"
          size="small"
          fullWidth
          value={data.repeatPassword}
          onChange={(e) => {
            setData({ ...data, repeatPassword: e.target.value });
          }}
        />
        {data.password &&
          data.repeatPassword &&
          data.password != data.repeatPassword && (
            <Typography color="error">Passwords do not match</Typography>
          )}
        <Typography color="error">{error}</Typography>
        <Button
          disabled={data.password != data.repeatPassword}
          type="submit"
          variant="contained"
          sx={{ width: "100%" }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
