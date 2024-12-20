import MenuIcon from "@mui/icons-material/Menu";
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid2,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Navigate,
  Outlet,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router";
import { MAX_WIDTH } from "../consts";
import { useAuth } from "../contexts/auth.context";
import { useCart } from "../contexts/cart.context";
import ADMIN_URL from "../utils/admin-url";
import useApi from "../utils/useApi.hook";
import useCurrentBreakpoint from "../utils/useCurrentBreakpoint.hook";

export default function Main() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const breakpoint = useCurrentBreakpoint();
  const navigate = useNavigate();
  const auth = useAuth();
  const cart = useCart();
  const api = useApi({
    method: "get",
    url: "/business/1",
    callOnMount: true,
  });

  if (location.pathname === "/") return <Navigate to="/menu" />;

  return (
    <Box sx={{ position: "relative" }}>
      <SignInDialog />
      <SignUpDialog />
      <ForgotPasswordDialog />
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          zIndex: 2,
          backgroundColor: "primary.dark",
        }}
      >
        <Box
          sx={(theme) => ({
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 3,
            position: "relative",
            gap: 4,
          })}
        >
          <Typography
            onClick={() => navigate("/")}
            variant="h5"
            sx={{
              fontWeight: "600",
            }}
          >
            Coffee Holic
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {breakpoint === "sm" || breakpoint === "xs" ? (
              <IconButton>
                <MenuIcon
                  sx={{ color: "white" }}
                  onClick={() => setOpen(true)}
                />
              </IconButton>
            ) : (
              <>
                <NavbarItem to="/menu">Menu</NavbarItem>
                <NavbarItem to="/reservations">Reserve Table</NavbarItem>
                <NavbarItem to="/about-us">FAQ</NavbarItem>
                <Badge badgeContent={cart.cart.length} showZero>
                  <NavbarItem to="my-order">My Order</NavbarItem>
                </Badge>
                {auth.user ? (
                  <MyAccountMenu />
                ) : (
                  <NavbarItem onClick={auth.openSignIn}>Sign In</NavbarItem>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
        <List sx={{ minWidth: "200px" }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setOpen(false);
                navigate("/menu");
              }}
            >
              <ListItemText primary={"Menu"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setOpen(false);
                navigate("/reservations");
              }}
            >
              <ListItemText primary={"Reserve Table"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setOpen(false);
                navigate("/about-us");
              }}
            >
              <ListItemText primary={"FAQ"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setOpen(false);
                navigate("/my-order");
              }}
            >
              <ListItemText primary={"My Order - " + cart.cart.length} />
            </ListItemButton>
          </ListItem>

          <Divider />

          {auth.user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-orders-and-reservations");
                  }}
                >
                  <ListItemText primary={"My Orders"} />
                </ListItemButton>
              </ListItem>
              {auth.user.isAdmin && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setOpen(false);
                      window.location.href =
                        ADMIN_URL + "?token=" + localStorage.getItem("token");
                    }}
                  >
                    <ListItemText primary={"Admin Panel"} />
                  </ListItemButton>
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    auth.signOut();
                  }}
                >
                  <ListItemText primary={"Log out"} />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  auth.openSignIn();
                }}
              >
                <ListItemText primary={"Sign in"} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      <Box sx={{ mt: 6, minHeight: "calc(100vh - 200px)", mb: 6 }}>
        <Outlet />
      </Box>
      <Box sx={{ backgroundColor: "primary.main", p: 2 }}>
        <Box
          sx={{
            width: "calc(100% - 20px)",
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
          }}
        >
          <Typography color="white" variant="h6">
            Contact us
          </Typography>
          <Typography color="white" variant="body1" sx={{ fontSize: "1.5rem" }}>
            Call {api?.data?.phone}
          </Typography>
          <Typography color="white" variant="body1" sx={{ fontSize: "1.5rem" }}>
            Email{" "}
            <Link
              to="mailto:hey@hey.com"
              sx={{ color: "white", cursor: "pointer" }}
            >
              {api?.data?.email}
            </Link>
          </Typography>

          <br />
          <Typography color="white" variant="h6">
            Opening Hours
          </Typography>
          <Typography color="white" variant="body1" sx={{ fontSize: "1.5rem" }}>
            {api?.data?.openingHours}
          </Typography>

          <br />
          <Typography color="white" variant="h6">
            Visit us
          </Typography>
          <Typography color="white" variant="body1" sx={{ fontSize: "1.5rem" }}>
            {api?.data?.address}
          </Typography>

          <iframe
            title="google maps location of coffeeholic"
            src={api?.data?.googleMapsUrl
              ?.split('src="')?.[1]
              ?.split("/n")?.[0]
              ?.replace('"', "")}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
}

function NavbarItem({ children, ...props }) {
  return (
    <Typography
      component={RouterLink}
      sx={{
        textDecoration: "none",
        color: "white",
        ":hover": {
          textDecoration: "underline",
        },
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

function MyAccountMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState();
  const auth = useAuth();

  return (
    <>
      <NavbarItem
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        My Account
      </NavbarItem>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/my-orders-and-reservations");
          }}
        >
          My Orders
        </MenuItem>
        {auth.user.isAdmin && (
          <MenuItem
            onClick={() => {
              window.location.href =
                ADMIN_URL + "?token=" + localStorage.getItem("token");
            }}
          >
            Admin Panel
          </MenuItem>
        )}
        <MenuItem onClick={auth.signOut}>Log out</MenuItem>
      </Menu>
    </>
  );
}

function SignInDialog() {
  const auth = useAuth();
  const [data, setData] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      component="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await auth.signIn(data);
        if (!response.ok) setError(response.error);
        console.log("RESPONSE: ", response);
      }}
      open={auth.open.signIn}
      onClose={auth.closeSignIn}
    >
      <DialogTitle>
        Sign In{" "}
        <Typography variant="body1" color="textSecondary">
          Enter phone number and password to sign in.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3} mt={1}>
          <Grid2 item size={12} mb={-1}>
            <TextField
              required
              size="small"
              label="Email or Phone Number"
              fullWidth
              value={data.phone}
              onChange={(e) => {
                setData({ ...data, phone: e.target.value });
              }}
            />
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              required
              size="small"
              label="Password"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
              fullWidth
              type="password"
            />
          </Grid2>
          <Grid2
            item
            size={12}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Button type="submit" variant="contained">
              Sign in
            </Button>
            <Button onClick={auth.closeSignIn}>Cancel</Button>
          </Grid2>

          {error && (
            <Typography color="error" textAlign={"center"} width="100%">
              {error}
            </Typography>
          )}

          <Grid2 item size={12} mb={-2}>
            <Typography textAlign={"center"}>
              <Link
                onClick={() => {
                  auth.openForgotPassword();
                  auth.closeSignIn();
                }}
              >
                Forgot your Password ?
              </Link>
            </Typography>
          </Grid2>
          <Grid2 item size={12}>
            <Typography textAlign={"center"}>
              New to Coffee Holic ?{" "}
              <Link
                onClick={() => {
                  auth.openSignUp();
                  auth.closeSignIn();
                }}
              >
                Sign up!
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
}

function SignUpDialog() {
  const auth = useAuth();
  const [data, setData] = useState({
    phone: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        const response = auth.signUp(data);
        if (response.error) {
          setError(response.error);
        }
      }}
      open={auth.open.signUp}
      onClose={auth.closeSignUp}
    >
      <DialogTitle>
        Sign Up{" "}
        <Typography variant="body1" color="textSecondary">
          Enter name, email, phone number and password to sign up.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3} mt={1}>
          <Grid2 item size={6}>
            <TextField
              required
              size="small"
              label="First Name"
              fullWidth
              value={data.firstName}
              onChange={(e) => {
                setData({ ...data, firstName: e.target.value });
              }}
              sx={{ minWidth: 0 }}
            />
          </Grid2>
          <Grid2 item size={6}>
            <TextField
              required
              size="small"
              label="Last Name"
              fullWidth
              value={data.lastName}
              onChange={(e) => {
                setData({ ...data, lastName: e.target.value });
              }}
              sx={{ minWidth: 0 }}
            />
          </Grid2>
          <Grid2 item size={12} mb={-1}>
            <TextField
              required
              size="small"
              label="Email"
              type="email"
              helperText="Will be used later for password recovery"
              fullWidth
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
              sx={{ minWidth: 0 }}
            />
          </Grid2>
          <Grid2 item size={12} mb={-1}>
            <TextField
              required
              size="small"
              label="Phone Number"
              helperText="Will be used later for validation and contact"
              fullWidth
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 8,
                },
              }}
              value={data.phone}
              onChange={(e) => {
                setData({ ...data, phone: e.target.value });
              }}
              sx={{ minWidth: 0 }}
            />
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              required
              size="small"
              label="Password"
              fullWidth
              type="password"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
              sx={{ minWidth: 0 }}
            />
          </Grid2>
          {error && (
            <Grid2 item size={12}>
              <Typography color="error">{error}</Typography>
            </Grid2>
          )}
          <Grid2
            item
            size={12}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Button type="submit" variant="contained">
              Sign up
            </Button>
            <Button onClick={auth.closeSignUp}>Cancel</Button>
          </Grid2>

          <Grid2 item size={12}>
            <Typography textAlign={"center"}>
              Already have an account ?{" "}
              <Link
                onClick={() => {
                  auth.closeSignUp();
                  auth.openSignIn();
                }}
              >
                Sign in!
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
}

function ForgotPasswordDialog() {
  const auth = useAuth();
  const [data, setData] = useState({ email: "" });
  const [error, setError] = useState("");

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      component="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await auth.forgotPassword(data);
        if (!response.ok) setError(response.error);
        console.log("RESPONSE: ", response);
      }}
      open={auth.open.forgotPassword}
      onClose={auth.closeForgotPassword}
    >
      <DialogTitle>
        Forgot Password ?{" "}
        <Typography variant="body1" color="textSecondary">
          Enter your email. We will send you an email with the next steps.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3} mt={1}>
          <Grid2 item size={12} mb={-1}>
            <TextField
              required
              size="small"
              type="email"
              label="Email"
              fullWidth
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </Grid2>

          <Grid2
            item
            size={12}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Button type="submit" variant="contained">
              Send Instructions Email
            </Button>
            <Button onClick={auth.closeForgotPassword}>Cancel</Button>
          </Grid2>

          {error && (
            <Typography color="error" textAlign={"center"} width="100%">
              {error}
            </Typography>
          )}

          <Grid2 item size={12} mb={0}>
            <Typography textAlign={"center"}>
              <Link
                onClick={() => {
                  auth.openSignIn();
                  auth.closeForgotPassword();
                }}
              >
                Remembered your Password ?
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
}
