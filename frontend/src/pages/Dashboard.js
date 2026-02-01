import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";

function Dashboard() {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Scan Items",
      description: "Scan barcodes to trigger reordering",
      icon: <QrCodeScannerIcon sx={{ fontSize: 30 }} />,
      color: "#1976d2",
      path: "/scan",
    },
    {
      title: "Kanban Cards",
      description: "Generate printable Kanban cards",
      icon: <PrintIcon sx={{ fontSize: 30 }} />,
      color: "#dc004e",
      path: "/kanban",
    },
    {
      title: "Order History",
      description: "View past reorders and transactions",
      icon: <HistoryIcon sx={{ fontSize: 30 }} />,
      color: "#2e7d32",
      onClick: () => alert("Order History - Connect to NetSuite API"),
    },
    {
      title: "Inventory",
      description: "View current stock levels",
      icon: <InventoryIcon sx={{ fontSize: 30 }} />,
      color: "#ed6c02",
      onClick: () => alert("Inventory Dashboard - Connect to NetSuite"),
    },
  ];
  
  const recentScans = [
    { item: "Widget Pro", bin: "BIN-A", time: "10:30 AM", status: "Pending" },
    { item: "Gadget Max", bin: "BIN-B", time: "9:45 AM", status: "Submitted" },
    { item: "Component X", bin: "BIN-A", time: "Yesterday", status: "Processed" },
    { item: "Tool Set", bin: "BIN-B", time: "Yesterday", status: "Processed" },
  ];
  
  const lowStockItems = [
    { name: "Widget Pro", current: 8, min: 10, bin: "BIN-A" },
    { name: "Gasket Small", current: 12, min: 15, bin: "BIN-B" },
    { name: "Bolt 5mm", current: 45, min: 50, bin: "BIN-A" },
    { name: "Washer 10mm", current: 22, min: 25, bin: "BIN-B" },
  ];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Kanban Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage inventory, generate Kanban cards, and process reorders
        </Typography>
      </Box>
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4">12</Typography>
                  <Typography variant="body2" color="textSecondary">Low Stock</Typography>
                </Box>
                <WarningIcon color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4">5</Typography>
                  <Typography variant="body2" color="textSecondary">Pending</Typography>
                </Box>
                <ScheduleIcon color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4">247</Typography>
                  <Typography variant="body2" color="textSecondary">Total Items</Typography>
                </Box>
                <InventoryIcon color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4">8</Typography>
                  <Typography variant="body2" color="textSecondary">Today's Scans</Typography>
                </Box>
                <TrendingUpIcon color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Menu */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
              onClick={item.onClick || (() => navigate(item.path))}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box sx={{ color: item.color, mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Recent Activity & Low Stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Scans
            </Typography>
            <List>
              {recentScans.map((scan, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {scan.status === "Processed" ? (
                        <CheckCircleIcon color="success" />
                      ) : scan.status === "Submitted" ? (
                        <ScheduleIcon color="info" />
                      ) : (
                        <WarningIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={scan.item}
                      secondary={`Bin: ${scan.bin} • ${scan.time}`}
                    />
                    <Typography
                      variant="caption"
                      color={
                        scan.status === "Processed" ? "success.main" :
                        scan.status === "Submitted" ? "info.main" : "warning.main"
                      }
                    >
                      {scan.status}
                    </Typography>
                  </ListItem>
                  {index < recentScans.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => alert("View all scans - Connect to NetSuite")}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Items
            </Typography>
            <List>
              {lowStockItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`Bin: ${item.bin} • Current: ${item.current}`}
                    />
                    <Box textAlign="right">
                      <Typography variant="body2" color="error.main">
                        Below Min
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Min: {item.min}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < lowStockItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              sx={{ mt: 2 }}
              onClick={() => navigate("/kanban")}
            >
              Generate Kanban Cards
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          📋 How to Use This System
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  1. Generate Kanban Cards
                </Typography>
                <Typography variant="body2">
                  Go to Kanban Cards page, select items, and print cards with barcodes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  2. Place Cards in Warehouse
                </Typography>
                <Typography variant="body2">
                  Attach cards to bins. When bin is low, scan the barcode.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  3. Scan & Reorder
                </Typography>
                <Typography variant="body2">
                  Scanning automatically creates reorder in NetSuite and switches bins.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Dashboard;