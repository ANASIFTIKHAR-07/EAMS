import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeModal = ({ open, mode, employee, onClose, onSuccess }) => {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
    status: "active", // default value
  });

  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        designation: employee.designation || "",
        password: "", // not editable
        status: employee.status || "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        designation: "",
        password: "",
        status: "active",
      });
    }
  }, [isEdit, employee, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:7000/api/v1/employees/${employee._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(
          "http://localhost:7000/api/v1/employees",
          formData,
          { withCredentials: true }
        );
        toast.success("Employee created successfully!");
      }

      onSuccess(); // refresh list
      onClose();   // close modal
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("❌ Something went wrong while saving employee.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Designation"
            name="designation"
            fullWidth
            value={formData.designation}
            onChange={handleChange}
          />
          {!isEdit && (
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
            />
          )}

          {isEdit && (
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeModal;
