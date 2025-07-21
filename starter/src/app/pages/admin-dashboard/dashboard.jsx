import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GroupIcon from "@mui/icons-material/Group";
import { toast } from "react-toastify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import Spinner from "@app/_shared/Spinner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: Loading } = useAuth();
  console.log("current user:", user);

  if (Loading) return <Spinner />;

  if (!user || user.role !== "admin") {
    return navigate("/unauthorized");
  }

  if (!user) return <CircularProgress />;

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    averageWorkingHours: 0,
  });
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ status: "", from: "", to: "" });
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      const res = await axios.get(
        `http://localhost:7000/api/v1/reports/attendance?${queryParams}`,
        { withCredentials: true }
      );

      console.log("📡 Full response from backend:", res.data);

      const data = res.data.message;
      console.log("📦 Attendance Records from backend:", data?.records);
      setStats({
        total: data?.totalRecords,
        present: data?.present,
        late: data?.late,
        absent: data?.absent,
        averageWorkingHours: data?.averageWorkingHours,
      });
      setRecords(Array.isArray(data?.records) ? data.records : []);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      toast.info("Exporting filtered records...");
      const queryParams = new URLSearchParams({ ...filters, export: "csv" });
      const res = await axios.get(
        `http://localhost:7000/api/v1/reports/attendance?${queryParams}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "filtered-attendance-report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to export filtered CSV:", error);
    }
  };

  const exportAllCSV = async () => {
    try {
      toast.info("Exporting full report...");
      const res = await axios.get(
        `http://localhost:7000/api/v1/reports/attendance?export=csv`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "all-attendance-report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to export full CSV:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ status: "", from: "", to: "" });
  };

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="late">Late</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="From"
            name="from"
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="To"
            name="to"
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center" gap={1}>
          <Button
            variant="contained"
            onClick={fetchReport}
            disabled={loading}
            fullWidth
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? "Loading..." : "Apply Filters"}
          </Button>
          <Button variant="outlined" onClick={clearFilters} fullWidth>
            Clear
          </Button>
        </Grid>
      </Grid>

      {/* Stats and Employees */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: "Total Records", value: stats.total },
          { title: "Present", value: stats.present },
          { title: "Late", value: stats.late },
          { title: "Absent", value: stats.absent },
          { title: "Avg. Working Hours", value: stats.averageWorkingHours },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={3}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                transition: "0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.3s ease-in-out",
              bgcolor: "background.paper", // default background
              "&:hover": {
                bgcolor: "primary.main", // set a solid hover background
                "& .card-title, & .card-subtext, & .card-icon": {
                  color: "common.white", // change text/icon to white
                },
              },
            }}
            onClick={() => navigate("/admin/employees")}
          >
            <CardContent>
              <GroupIcon
                className="card-icon"
                sx={{
                  fontSize: 40,
                  mb: 1,
                  color: "primary.main",
                  transition: "color 0.3s",
                }}
              />
              <Typography
                variant="h6"
                className="card-title"
                sx={{ color: "text.primary", transition: "color 0.3s" }}
              >
                Manage Employees
              </Typography>
              <Typography
                variant="body2"
                className="card-subtext"
                sx={{ color: "text.secondary", transition: "color 0.3s" }}
              >
                View, add, update, or remove employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Buttons */}
      <Grid container spacing={2} mb={3}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportCSV}
          >
            Export Filtered
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FileDownloadIcon />}
            onClick={exportAllCSV}
          >
            Export All
          </Button>
        </Grid>
      </Grid>

      {/* Attendance Table */}
      <Typography variant="h6" gutterBottom>
        Attendance Records
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Check-In</TableCell>
            <TableCell>Check-Out</TableCell>
            <TableCell>Working Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            records.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.user?.name || "—"}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color:
                        r.status === "present"
                          ? "success.main"
                          : r.status === "late"
                            ? "warning.main"
                            : "error.main",
                      textTransform: "capitalize",
                    }}
                  >
                    {r.status}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(r.checkIn).toLocaleString()}</TableCell>
                <TableCell>
                  {r.checkOut ? new Date(r.checkOut).toLocaleString() : "—"}
                </TableCell>
                <TableCell>{r.workingHours ?? "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
