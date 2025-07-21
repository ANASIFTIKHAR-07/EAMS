import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import EmployeeModal from "./employeeModal";
import { toast } from "react-toastify";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:7000/api/v1/employees", {
        withCredentials: true,
      });
      setEmployees(res.data.message || []);
    } catch (err) {
      console.error("Error fetching employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openModal = (mode, data = null) => {
    setModalMode(mode);
    setSelectedEmployee(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await axios.delete(`http://localhost:7000/api/v1/employees/${id}`, {
        withCredentials: true,
      });
      fetchEmployees();
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated employees
  const paginatedEmployees = employees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Button variant="contained" onClick={() => openModal("add")} sx={{ mb: 2 }}>
        Add Employee
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openModal("edit", emp)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={employees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      <EmployeeModal
        open={modalOpen}
        mode={modalMode}
        employee={selectedEmployee}
        onClose={closeModal}
        onSuccess={fetchEmployees}
      />
    </>
  );
};

export default EmployeesPage;
