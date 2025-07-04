import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, Button, Container, Typography, Box, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: '',
    employeeId: ''
  });
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeesResponse = await axios.get('http://localhost:8082/employees');
        setEmployees(employeesResponse.data);
        
        if (id) {
          const taskResponse = await axios.get(`http://localhost:8083/tasks/${id}`);
          setTask({
            ...taskResponse.data,
            dueDate: taskResponse.data.dueDate ? new Date(taskResponse.data.dueDate).toISOString().split('T')[0] : ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8083/tasks/${id}`, task);
      } else {
        await axios.post('http://localhost:8083/tasks', task);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Task' : 'Create New Task'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={task.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={task.description}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={task.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={task.dueDate}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Employee</InputLabel>
            <Select
              name="employeeId"
              value={task.employeeId}
              label="Assigned Employee"
              onChange={handleChange}
              required
            >
              {employees.map(employee => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? 'Update Task' : 'Create Task'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TaskForm;