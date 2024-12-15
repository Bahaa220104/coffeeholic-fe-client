import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import AboutUs from "./views/about.view";
import Main from "./views/main.view";
import Menu from "./views/menu.view";
import Reservations from "./views/reservations.view";

import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import ReservationsSucess from "./views/reservations-success.view";
import MyOrder from "./views/order.view";
import MyOrders from "./views/orders.view";
import { AuthProvider } from "./contexts/auth.context";
import { CartProvider } from "./contexts/cart.context";
import ResetPassword from "./views/reserpassword.view";

const theme = createTheme({
  typography: {
    fontFamily: "Fira Sans",
  },
  palette: {
    primary: {
      main: "#124a28", //"#4ade80",
      light: "#bbf7d0",
      dark: "#124a28",
      contrastText: "#fff",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthProvider>
                <CartProvider>
                  <Main />
                </CartProvider>
              </AuthProvider>
            }
          >
            <Route path="/menu" element={<Menu />}></Route>
            <Route path="/about-us" element={<AboutUs />}></Route>
            <Route path="/reservations">
              <Route index element={<Reservations />} />
              <Route
                path="/reservations/success"
                element={<ReservationsSucess />}
              />
            </Route>
            <Route path="/my-order" element={<MyOrder />}></Route>
            <Route
              path="/my-orders-and-reservations"
              element={<MyOrders />}
            ></Route>
          </Route>
          <Route path="auth/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
