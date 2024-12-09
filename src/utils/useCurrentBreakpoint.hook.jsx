import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function useCurrentBreakpoint() {
  const theme = useTheme();

  // Check breakpoints from largest to smallest
  const matchesXl = useMediaQuery(theme.breakpoints.up("xl"));
  const matchesLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.up("sm"));

  if (matchesXl) return "xl";
  if (matchesLg) return "lg";
  if (matchesMd) return "md";
  if (matchesSm) return "sm";
  return "xs";
}

export default useCurrentBreakpoint;
