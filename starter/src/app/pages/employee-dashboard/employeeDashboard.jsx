import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import Spinner from "@app/_shared/Spinner";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { user: authUser, loading: authLoading, loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!loggedInUser || loggedInUser.role !== "employee") {
      navigate("/unauthorized");
    }
  }, [authLoading, navigate, loggedInUser]);

  const fetchUserAndAttendance = async () => {
    setLoading(true);
    try {
      const [userRes, attendanceRes] = await Promise.all([
        axios.get("http://localhost:7000/api/v1/auth/me", { withCredentials: true }),
        axios.get("http://localhost:7000/api/v1/attendance", { withCredentials: true }),
      ]);

      const userData = userRes?.data?.message ?? null;
      const records = attendanceRes?.data?.message.records ?? [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.checkIn) - new Date(a.checkIn)
      );

      setUser(userData);
      setAttendance(sortedRecords);

      const today = new Date();
      const todayRec = sortedRecords.find((r) => {
        const recordDate = new Date(r.checkIn);
        return (
          recordDate.getDate() === today.getDate() &&
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getFullYear() === today.getFullYear()
        );
      });

      setTodayRecord(todayRec || null);
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setUser(null);
      setAttendance([]);
      setTodayRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setActionLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          await axios.post(
            "http://localhost:7000/api/v1/attendance/check-in",
            { lat, lng },
            { withCredentials: true }
          );
          toast.success("✅ Check-in successful!");
          await fetchUserAndAttendance();
        } catch (err) {
          const msg = err?.response?.data?.message;
          if (msg === "Already Checked In.") toast.info("Already checked in today.");
          else if (msg?.includes("outside")) toast.warning(msg);
          else toast.error(msg || "Check-in failed.");
        } finally {
          setActionLoading(false);
        }
      },
      () => {
        toast.error("Location access denied.");
        setActionLoading(false);
      }
    );
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await axios.post("http://localhost:7000/api/v1/attendance/check-out", {}, { withCredentials: true });
      toast.success("✅ Checked out successfully!");
      await fetchUserAndAttendance();
    } catch (err) {
      toast.error("❌ Check-out failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "—";
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    if (authUser?.role === "employee") fetchUserAndAttendance();
  }, [authUser]);

  if (authLoading) return <Spinner />;
  if (!loggedInUser) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        Welcome, {user?.name || "Employee"}
      </Typography>

      <Button
        variant="text"
        startIcon={<RefreshIcon />}
        onClick={fetchUserAndAttendance}
        sx={{ mb: 3 }}
      >
        Refresh Attendance
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Today's Attendance
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {todayRecord?.status || "Not marked yet"}
                  </Typography>
                  <Typography variant="body2">
                    Check-In: {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString() : "—"}
                  </Typography>
                  <Typography variant="body2">
                    Check-Out: {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString() : "—"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center" height="100%">
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={handleCheckIn}
                  disabled={!!todayRecord?.checkIn || actionLoading}
                >
                  {actionLoading ? <CircularProgress size={18} /> : "Check In"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<LogoutIcon />}
                  onClick={handleCheckOut}
                  disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut || actionLoading}
                >
                  {actionLoading ? <CircularProgress size={18} /> : "Check Out"}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Attendance History
          </Typography>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check-In</TableCell>
                <TableCell>Check-Out</TableCell>
                <TableCell>Working Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          record.status === "present"
                            ? "success.main"
                            : record.status === "late"
                            ? "warning.main"
                            : "error.main"
                        }
                      >
                        {record.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "—"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "—"}
                    </TableCell>
                    <TableCell>
                      {calculateWorkingHours(record.checkIn, record.checkOut)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default EmployeeDashboard;
