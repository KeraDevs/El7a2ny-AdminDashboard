import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesData {
  day: string;
  amount: number;
  date: string;
}

interface DetailedSalesData {
  currentWeek: {
    total: number;
    percentageChange: number;
    dailyData: SalesData[];
  };
  previousWeek: {
    total: number;
    dailyData: SalesData[];
  };
}

const cardStyles = {
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "8px",
  width: "100%",
  height: "100%",
};

const initialSalesData: DetailedSalesData = {
  currentWeek: {
    total: 12423,
    percentageChange: 23,
    dailyData: [
      { day: "Mon", amount: 1850, date: "2024-01-01" },
      { day: "Tue", amount: 2100, date: "2024-01-02" },
      { day: "Wed", amount: 1950, date: "2024-01-03" },
      { day: "Thu", amount: 2300, date: "2024-01-04" },
      { day: "Fri", amount: 2150, date: "2024-01-05" },
      { day: "Sat", amount: 2800, date: "2024-01-06" },
      { day: "Sun", amount: 3200, date: "2024-01-07" },
    ],
  },
  previousWeek: {
    total: 10100,
    dailyData: [
      { day: "Mon", amount: 1500, date: "2023-12-25" },
      { day: "Tue", amount: 1800, date: "2023-12-26" },
      { day: "Wed", amount: 1600, date: "2023-12-27" },
      { day: "Thu", amount: 1900, date: "2023-12-28" },
      { day: "Fri", amount: 1700, date: "2023-12-29" },
      { day: "Sat", amount: 2100, date: "2023-12-30" },
      { day: "Sun", amount: 2400, date: "2023-12-31" },
    ],
  },
};

// Mock API call
const fetchSalesData = async (): Promise<DetailedSalesData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialSalesData);
    }, 1000);
  });
};

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<DetailedSalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 days");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (period?: string) => {
    if (period) {
      setSelectedPeriod(period);
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSalesData();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card
        sx={{
          maxWidth: 345,
          bgcolor: "white",
          color: "black",
          borderRadius: 2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Card>
    );
  }

  if (!salesData) {
    return (
      <Card
        sx={{
          maxWidth: 345,
          bgcolor: "white",
          color: "black",
          borderRadius: 2,
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>No data available</Typography>
      </Card>
    );
  }

  const chartData = {
    labels: salesData.currentWeek.dailyData.map((item) => item.day),
    datasets: [
      {
        data: salesData.currentWeek.dailyData.map((item) => item.amount),
        fill: false,
        borderColor: "#8884d8",
        tension: 0.4,
      },
      {
        data: salesData.previousWeek.dailyData.map((item) => item.amount),
        fill: false,
        borderColor: "rgba(136, 132, 216, 0.3)",
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card
      sx={{
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "8px",
        width: "100%",
        cardStyles,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              ${salesData.currentWeek.total.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#9ca3af" }}>
              Sales this week
            </Typography>
          </Box>
          <Typography
            sx={{
              color:
                salesData.currentWeek.percentageChange >= 0
                  ? "#10b981"
                  : "#ef4444",
              display: "flex",
              alignItems: "center",
            }}
          >
            {salesData.currentWeek.percentageChange >= 0 && "+"}
            {salesData.currentWeek.percentageChange}%
            <ArrowUpwardIcon fontSize="small" />
          </Typography>
        </Box>

        <Box sx={{ height: 100, mt: 2 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box>
            <Box
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#9ca3af",
              }}
            >
              <Typography sx={{ mr: 1 }}>{selectedPeriod}</Typography>
              <KeyboardArrowDownIcon />
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleClose()}
              PaperProps={{
                sx: {
                  mt: 1,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuItem onClick={() => handleClose("Last 7 days")}>
                Last 7 days
              </MenuItem>
              <MenuItem onClick={() => handleClose("Last 30 days")}>
                Last 30 days
              </MenuItem>
              <MenuItem onClick={() => handleClose("Last 90 days")}>
                Last 90 days
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            sx={{
              color: "#3b82f6",
              cursor: "pointer",
              "&:hover": {
                color: "#2563eb",
              },
            }}
          >
            SALES REPORT →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
