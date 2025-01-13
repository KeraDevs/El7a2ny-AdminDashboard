import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SectionFooter from "./SectionFooter";

interface RecentActivity {
  id: number;
  type: string;
  user: string;
  workshop: string;
  status: string;
  time: string;
}
const cardStyles = {
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "8px",
  width: "100%",
  height: "100%",
};

const RequetsHistory: React.FC = () => {
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsActivitiesLoading(false), 1700);
    };
    loadData();
  }, []);

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "Workshop Request",
      user: "John Doe",
      workshop: "AutoFix Pro",
      status: "Pending",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "Service Completed",
      user: "Sarah Smith",
      workshop: "Car Masters",
      status: "Completed",
      time: "25 min ago",
    },
    {
      id: 3,
      type: "New Registration",
      user: "Mike Johnson",
      workshop: "Tune Expert",
      status: "New",
      time: "1 hour ago",
    },
  ];
  return (
    <>
      <Grid>
        <Card
          className="border border-gray-200"
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "8px",
            width: "100%",
            cardStyles,
          }}
        >
          <CardContent>
            <Typography variant="h6" className="mb-6">
              Recent Activities
            </Typography>
            {isActivitiesLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={40}
                    className="mb-2"
                  />
                ))}
              </>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Workshop</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>{activity.workshop}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              activity.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </TableCell>
                        <TableCell>{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <SectionFooter link="/requests" />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default RequetsHistory;
