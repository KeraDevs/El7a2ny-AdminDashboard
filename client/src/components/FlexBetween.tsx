import { styled, Box, BoxProps } from "@mui/material";

const FlexBetween = styled(Box)<BoxProps>(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default FlexBetween;
