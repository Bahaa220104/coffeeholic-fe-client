import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid2,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_WIDTH } from "../consts";
import useApi from "../utils/useApi.hook";
import useWidthObserver from "../utils/useWidthObserver.hook";
import { useCart } from "../contexts/cart.context";

export default function Menu() {
  const api = useApi({ url: "/categories", method: "get", callOnMount: true });
  console.log("API: ", api.data);

  const items = (
    api.data?.map((category) => {
      return {
        ...category,
        products: category.products.filter((p) =>
          p.types.map((t) => t.name).includes("product")
        ),
      };
    }) || []
  ).filter((category) => {
    return category.products.length > 0;
  });

  const [value, setValue] = useState(0);

  const categoryRefs = useRef([]);

  const HEADER_OFFSET = 105;
  const setCategoryRef = useCallback((node, index) => {
    if (node) {
      categoryRefs.current[index] = node;
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const target = categoryRefs.current[newValue];
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - HEADER_OFFSET;
      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentIndex = 0;
      const scrollOffset = window.scrollY + HEADER_OFFSET;

      for (let i = 0; i < categoryRefs.current.length; i++) {
        const rect = categoryRefs.current[i].getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top - HEADER_OFFSET <= scrollOffset) {
          currentIndex = i;
        } else {
          break;
        }
      }

      if (currentIndex !== value) {
        setValue(currentIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [value, HEADER_OFFSET]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 48,
          zIndex: 2,
          backgroundColor: "primary.dark",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.22)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
            sx={{
              ".MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.3,
              },
              width: "100%",
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
            }}
          >
            {items.map((item) => (
              <Tab label={item.name} key={"Tab cat: " + item.id} />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box
        mt={12}
        sx={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          mx: "auto",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", sm: "3rem" } }}
          fontWeight={700}
          mb={3}
          py={2}
          pt={4}
          px={2}
        >
          Our Menu
        </Typography>
        <Grid2
          container
          sx={{
            width: "100%",
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
          }}
        >
          {items.map((item, index) => (
            <Box
              key={"Category: " + item.id}
              ref={(node) => setCategoryRef(node, index)}
              sx={{ width: "100%" }}
            >
              <CategoryItem item={item} />
            </Box>
          ))}
        </Grid2>
      </Box>
    </>
  );
}
function CategoryItem({ item }) {
  return (
    <>
      <Grid2 size={12} sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          {item.name}
        </Typography>
      </Grid2>
      <Grid2 item size={12} container spacing={4} sx={{ p: 2 }}>
        {item.products.map((p) => (
          <MenuItem item={p} key={"Product: " + p.id} />
        ))}
      </Grid2>
    </>
  );
}

function MenuItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <Grid2
      item
      size={{
        lg: 3,
        md: 3,
        sm: 4,
        xs: 6,
      }}
      container
      spacing={2}
      onClick={() => {
        setOpen(true);
      }}
      sx={{
        ":hover": {
          textDecoration: "underline",
          cursor: "pointer",
        },
      }}
    >
      <Grid2
        size={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MenuItemDialog item={item} open={open} setOpen={setOpen} />
        <Avatar
          sx={{
            height: "100%",
            width: "calc(100%)",
            maxWidth: { lg: "250px" },
            aspectRatio: "1 / 1",
          }}
          src={item.image}
        />
      </Grid2>
      <Grid2 size={12}>
        <Typography textAlign={"center"}>{item.name.toUpperCase()}</Typography>
        <Typography textAlign={"center"}>
          LBP {item.price.toLocaleString()}
        </Typography>
      </Grid2>
    </Grid2>
  );
}

function MenuItemDialog({ open, setOpen, item }) {
  const cart = useCart();
  const [selected, setSelected] = useState({ variants: {}, addons: {} });

  const price =
    item.price +
    Object.values(selected.variants).reduce((prev, curr) => {
      return prev + curr.price;
    }, 0) +
    Object.values(selected.addons).reduce((prev, curr) => {
      return prev + curr.price;
    }, 0);

  const [openSnackbar, setOpenSnackbar] = useState(null);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="info"
          variant="filled"
        >
          Item Added to Order.
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            py: 0,
            pt: 1,
            pr: 1,
          }}
        >
          {item.name}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              console.log("Settings open to false");
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2
              item
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                src={item.image}
                sx={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                }}
              />
            </Grid2>
            <Grid2 item size={12}>
              <Typography variant="h6">
                {item.price.toLocaleString()} LBP
              </Typography>
            </Grid2>
            <Grid2 item size={12}>
              <Typography variant="body2">{item.description}</Typography>
            </Grid2>

            {item.variantGroups.map((group) => {
              return (
                <Grid2 item size={12} key={"Group: " + group.id}>
                  <FormControl>
                    <FormLabel>{group.name}</FormLabel>
                    <RadioGroup
                      row
                      value={selected.variants?.[group.id]?.id}
                      onChange={(e) => {
                        setSelected({
                          ...selected,
                          variants: {
                            ...selected.variants,
                            [group.id]: group.variants.find(
                              (v) => v.id == e.target.value
                            ),
                          },
                        });
                      }}
                    >
                      {group.variants.map((variant) => {
                        return (
                          <FormControlLabel
                            key={"Variant: " + variant.id}
                            value={variant.id}
                            control={<Radio />}
                            label={
                              variant.name +
                              (variant.price
                                ? ` (+ ${variant.price.toLocaleString()} LBP)`
                                : "")
                            }
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid2>
              );
            })}

            {!!item.addons.length && (
              <Grid2 item size={12}>
                <FormGroup>
                  <FormLabel>Addons</FormLabel>
                  {item.addons.map((addon) => {
                    return (
                      <FormControlLabel
                        key={"Addon: " + addon.id}
                        checked={selected.addons?.[addon.id]?.id == addon.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected({
                              ...selected,
                              addons: {
                                ...selected.addons,
                                [addon.id]: addon,
                              },
                            });
                          } else {
                            const newAddons = { ...selected.addons };
                            delete newAddons[addon.id];
                            setSelected({ ...selected, addons: newAddons });
                          }
                        }}
                        control={<Checkbox defaultChecked />}
                        label={
                          addon.name +
                          " (+ " +
                          addon.price.toLocaleString() +
                          " LBP)"
                        }
                      />
                    );
                  })}
                </FormGroup>
              </Grid2>
            )}
          </Grid2>
        </DialogContent>
        <DialogActions>
          {console.log(
            Object.keys(selected.variants).length,
            item.variantGroups.length
          )}
          <Button
            variant="contained"
            disabled={
              Object.keys(selected.variants).length != item.variantGroups.length
            }
            onClick={() => {
              setOpenSnackbar(Math.random());
              cart.add({
                product: item,
                addons: Object.values(selected.addons),
                variants: Object.values(selected.variants),
              });
            }}
          >
            Add to Order - {price.toLocaleString()} LBP
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
