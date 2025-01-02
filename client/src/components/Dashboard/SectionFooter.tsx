import React from "react";
import { Button } from "@mui/material";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { Box } from "@mui/system";

interface SectionFooterProps {
  link: string;
}

const SectionFooter: React.FC<SectionFooterProps> = ({ link }) => (
  <Box className="mt-4 pt-3 border-t border-gray-200">
    <Button
      endIcon={<LaunchRoundedIcon />}
      href={link}
      size="small"
      variant="text"
      className="text-blue-600 hover:text-blue-800 text-sm"
    >
      VIEW ALL
    </Button>
  </Box>
);

export default SectionFooter;
