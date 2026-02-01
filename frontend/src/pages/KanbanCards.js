import React, { useState, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Print, Search, FilterList, Download, QrCode, Delete } from "@mui/icons-material";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";

// Mock data
const mockItems = [
  {
    id: "1001",
    internalId: "1001",
    itemName: "Widget Pro",
    displayName: "Premium Widget Pro",
    type: "Inventory Item",
    location: "Main Warehouse",
    reorderPoint: 10,
    preferredVendor: "Vendor Corp Inc.",
    basePrice: 24.99,
    bins: [
      { binId: "BIN-A", quantity: 8, maxQuantity: 50 },
      { binId: "BIN-B", quantity: 45, maxQuantity: 50 }
    ]
  },
  {
    id: "1002",
    internalId: "1002",
    itemName: "Gadget Max",
    displayName: "Advanced Gadget Max",
    type: "Assembly",
    location: "East Warehouse",
    reorderPoint: 15,
    preferredVendor: "Tech Supplies Inc",
    basePrice: 89.99,
    bins: [
      { binId: "BIN-A", quantity: 3, maxQuantity: 30 },
      { binId: "BIN-B", quantity: 28, maxQuantity: 30 }
    ]
  },
];

function KanbanCardPrint({ item }) {
  const frontendUrl = window.location.origin;
  
  return (
    <Paper sx={{ p: 2, mb: 2, border: "1px solid #ddd", width: "100%", maxWidth: "400px" }}>
      <Box sx={{ borderBottom: "2px solid #1976d2", pb: 1, mb: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          KANBAN CARD
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption">
            ID: {item.internalId}
          </Typography>
          <Chip 
            label={item.type} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {item.displayName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {item.itemName}
        </Typography>
        <Typography variant="body2">
          Location: {item.location}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          BIN INFORMATION
        </Typography>
        <Grid container spacing={1}>
          {item.bins.map((bin, index) => (
            <Grid item xs={12} key={bin.binId}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  bgcolor: index === 0 ? "#e3f2fd" : "#f5f5f5" 
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {bin.binId} {index === 0 && "(Active)"}
                </Typography>
                <Typography variant="body1">
                  {bin.quantity} / {bin.maxQuantity}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
        <Typography variant="caption" display="block" gutterBottom>
          SCAN TO REORDER
        </Typography>
        <Barcode
          value={`${frontendUrl}/scan?itemId=${item.id}&binId=${item.bins[0].binId}&location=${encodeURIComponent(item.location)}`}
          format="CODE128"
          width={1.5}
          height={40}
          displayValue={false}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          {item.bins[0].binId} • {item.location}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2, pt: 1, borderTop: "1px dashed #ccc" }}>
        <Typography variant="caption" color="textSecondary" align="center">
          Scan when bin is low
        </Typography>
      </Box>
    </Paper>
  );
}

function KanbanCards() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
  });
  const [printDialog, setPrintDialog] = useState(false);
  const printRef = useRef();
  
  const filteredItems = mockItems.filter(item => {
    if (filters.location && item.location !== filters.location) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(searchLower) ||
        item.displayName.toLowerCase().includes(searchLower) ||
        item.internalId.includes(filters.search)
      );
    }
    return true;
  });
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  
  const generateBarcodeUrl = (item) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/scan?itemId=${item.id}&binId=${item.bins[0].binId}&location=${encodeURIComponent(item.location)}`;
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kanban Cards
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Select items to generate printable Kanban cards with barcodes
        </Typography>
      </Box>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Items"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                  <MenuItem value="East Warehouse">East Warehouse</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Item Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Item Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Inventory Item">Inventory Item</MenuItem>
                  <MenuItem value="Assembly">Assembly</MenuItem>
                  <MenuItem value="Non-Inventory">Non-Inventory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({ search: "", location: "", type: "" })}
                startIcon={<FilterList />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {selectedItems.length} item(s) selected for printing
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setPrintDialog(true)}
                  startIcon={<Print />}
                  sx={{ mr: 2 }}
                >
                  Print Cards
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedItems([])}
                  sx={{ color: "white", borderColor: "white" }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredItems.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Bin Status</TableCell>
              <TableCell>Barcode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.id}
                hover
                selected={selectedItems.some(i => i.id === item.id)}
                onClick={() => handleSelectItem(item)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.some(i => i.id === item.id)}
                    onChange={() => handleSelectItem(item)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {item.displayName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {item.internalId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.type}
                    size="small"
                    color={
                      item.type === "Inventory Item" ? "primary" :
                      item.type === "Assembly" ? "secondary" : "default"
                    }
                  />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Box>
                    {item.bins.map((bin) => (
                      <Typography key={bin.binId} variant="body2">
                        {bin.binId}: {bin.quantity}/{bin.maxQuantity}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Preview barcode">
                    <IconButton size="small">
                      <QrCode />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No items found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your filters
          </Typography>
        </Box>
      )}
      
      {/* Print Dialog */}
      <Dialog
        open={printDialog}
        onClose={() => setPrintDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Print Kanban Cards</DialogTitle>
        <DialogContent>
          <Box ref={printRef}>
            <Grid container spacing={2}>
              {selectedItems.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <KanbanCardPrint item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialog(false)}>Cancel</Button>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" startIcon={<Print />}>
                Print {selectedItems.length} Cards
              </Button>
            )}
            content={() => printRef.current}
            onAfterPrint={() => setPrintDialog(false)}
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default KanbanCards;  