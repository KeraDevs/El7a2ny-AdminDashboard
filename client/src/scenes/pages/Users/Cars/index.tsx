import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from "@mui/material";
import { Refresh, Add } from "@mui/icons-material";

interface Car {
  id: string;
  licensePlate: string;
  vinNumber: string;
  owner: string;
  model: string;
  isActive: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        headers: { "x-api-key": API_KEY },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch cars. Status: ${response.status}`);
      }
      const result = await response.json();
      setCars(result.cars || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <Box className="p-6">
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">Cars</Typography>
        <Box>
          <IconButton onClick={fetchCars} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => console.log("Add Car Clicked")}
            className="ml-2"
          >
            Add Car
          </Button>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <Box className="flex justify-center p-6">
          <CircularProgress />
        </Box>
      ) : (
        <Card className="p-4">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>License Plate</TableCell>
                  <TableCell>VIN Number</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cars.length > 0 ? (
                  cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>{car.licensePlate}</TableCell>
                      <TableCell>{car.vinNumber}</TableCell>
                      <TableCell>{car.owner}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>
                        <Chip
                          label={car.isActive ? "Active" : "Inactive"}
                          color={car.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No cars available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

export default Cars;
