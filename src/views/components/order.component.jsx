import { Avatar, Box, Button, Card, Grid2, Typography } from "@mui/material";
import { useCart } from "../../contexts/cart.context";

export default function Order({ order }) {
  const cart = useCart();
  return (
    <Grid2 container spacing={2}>
      {!order?.length ? (
        <Box
          sx={{
            minHeight: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign={"center"}
          >
            Nothing here yet!
          </Typography>
        </Box>
      ) : (
        order.map((item, index) => {
          return (
            <Grid2
              item
              size={{ md: 4, xs: 12, sm: 6 }}
              key={"Itme: " + item.product.id}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "start",
                }}
              >
                <Box
                  sx={{
                    aspectRatio: 1,
                  }}
                >
                  <Avatar
                    src={item.product.image}
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">{item.product.name}</Typography>
                  <Typography variant="body1">
                    {item.product.description}
                  </Typography>
                  <Typography variant="h6" mt={2}>
                    Price
                  </Typography>
                  <Typography variant="body1">
                    {item.product.price.toLocaleString()} LBP
                  </Typography>
                  <Typography variant="h6" mt={2}>
                    Addons
                  </Typography>
                  <Grid2 container spacing={3}>
                    {item.addons.map((addon) => {
                      return (
                        <Grid2 size={12} item key={"Addong: " + addon.id}>
                          <Typography variant="body1">
                            {addon.name} (+ {addon.price.toLocaleString()} LBP)
                          </Typography>
                        </Grid2>
                      );
                    })}
                  </Grid2>
                  <Typography variant="h6" mt={2}>
                    Variants
                  </Typography>
                  <Grid2 container spacing={3}>
                    {item.variants.map((variant) => {
                      return (
                        <Grid2 size={12} item key={"variant: " + variant.id}>
                          <Typography variant="h6">
                            {variant.variantGroup.name}
                          </Typography>
                          <Typography>
                            {variant.name}{" "}
                            {variant.price ? (
                              <>(+ {variant.price.toLocaleString()} LBP)</>
                            ) : null}
                          </Typography>
                        </Grid2>
                      );
                    })}
                  </Grid2>

                  <Typography variant="h6" mt={2}>
                    Price
                  </Typography>
                  <Typography>
                    {(
                      item.product.price +
                      item.addons.reduce((prev, curr) => {
                        return prev + curr.price;
                      }, 0) +
                      item.variants.reduce((prev, curr) => {
                        return prev + curr.price;
                      }, 0)
                    ).toLocaleString()}{" "}
                    LBP
                  </Typography>

                  <Box mt={2} />
                  <Button color="error" onClick={() => cart.remove(index)}>
                    Remove
                  </Button>
                </Box>
              </Card>
            </Grid2>
          );
        })
      )}
    </Grid2>
  );
}
