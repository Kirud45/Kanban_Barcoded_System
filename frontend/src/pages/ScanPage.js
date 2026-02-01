import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FactoryIcon from "@mui/icons-material/Factory";

const steps = ["Scan Barcode", "Review Item", "Reorder Details"];

function ScanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState("");
  
  // Check for URL parameters from barcode scan
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const binId = params.get("binId");
  const locationId = params.get("location");
  
  // Auto-load item if scanned
  useEffect(() => {
    if (itemId && !itemData) {
      loadItemData(itemId);
      setActiveStep(1); // Skip to review step
    }
  }, [itemId]);
  
  const loadItemData = async (id) => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockItem = {
        id: id || "1001",
        itemName: "Widget Pro",
        displayName: "Premium Widget Pro",
        type: "Inventory Item",
        location: locationId || "Main Warehouse",
        reorderPoint: 10,
        preferredVendor: "Vendor Corp Inc.",
        unitPrice: 24.99,
        bins: [
          { binId: binId || "BIN-A", quantity: 8, maxQuantity: 50 },
          { binId: binId === "BIN-A" ? "BIN-B" : "BIN-A", quantity: 45, maxQuantity: 50 }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setItemData(mockItem);
      
      // Set suggested quantity
      const activeBin = mockItem.bins.find(bin => bin.binId === (binId || "BIN-A"));
      if (activeBin) {
        setQuantity(activeBin.maxQuantity - activeBin.quantity);
        setNotes(`Replenish ${activeBin.binId}`);
      }
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSimulateScan = () => {
    // Simulate scanning item 1001
    navigate("/scan?itemId=1001&binId=BIN-A&location=Main%20Warehouse");
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleReset = () => {
    setItemData(null);
    setActiveStep(0);
    setQuantity(50);
    setNotes("");
    navigate("/scan");
  };
  
  const handleSubmitToNetSuite = () => {
    // NetSuite OAuth redirect URL
    const netsuiteBaseUrl = "https://system.netsuite.com";
    const itemParam = itemData ? encodeURIComponent(itemData.displayName) : "";
    const quantityParam = quantity;
    const binParam = binId || "BIN-A";
    
    // Create a mock URL for demonstration
    const mockNetSuiteUrl = `${netsuiteBaseUrl}/app/center/card.nl?sc=-29&whence=`;
    
    alert(`📤 Ready to submit to NetSuite:\n\nItem: ${itemData?.displayName}\nQuantity: ${quantity}\nBin: ${binParam}\n\nAfter submission, active bin will switch to ${getAlternateBin()?.binId}`);
    
    // In real implementation, this would redirect to NetSuite
    // window.location.href = mockNetSuiteUrl;
    
    // Reset for next scan
    handleReset();
  };
  
  const getActiveBin = () => {
    if (!itemData || !binId) return null;
    return itemData.bins.find(bin => bin.binId === binId);
  };
  
  const getAlternateBin = () => {
    if (!itemData || !binId) return null;
    return itemData.bins.find(bin => bin.binId !== binId);
  };
  
  const calculateTotal = () => {
    return itemData ? (itemData.unitPrice * quantity).toFixed(2) : "0.00";
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <FactoryIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" gutterBottom align="center">
            Warehouse Scanner
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" align="center">
          Scan Kanban barcode to reorder items • No login required
        </Typography>
      </Box>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {activeStep === 0 && (
          <Box textAlign="center" py={4}>
            <QrCodeScannerIcon sx={{ fontSize: 80, color: "#1976d2", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Ready to Scan
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Point barcode scanner at Kanban card
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
              <Typography variant="body2">
                • Scanner will automatically navigate to this page
                <br />
                • No login required for scanning
                <br />
                • NetSuite login only needed when submitting order
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSimulateScan}
                startIcon={<QrCodeScannerIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Simulate Barcode Scan
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
                (For testing without a scanner)
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      📋 How it works:
                    </Typography>
                    <Typography variant="body2">
                      1. Scan Kanban card barcode
                      <br />
                      2. Review item details
                      <br />
                      3. Confirm reorder quantity
                      <br />
                      4. Submit to NetSuite
                      <br />
                      5. System switches bins automatically
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      🔄 Bin Switching:
                    </Typography>
                    <Typography variant="body2">
                      When Bin A is empty:
                      <br />
                      • Scan → Reorder Bin A
                      <br />
                      • Active bin switches to Bin B
                      <br />
                      • Next scan will reorder Bin B
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeStep === 1 && itemData && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                📦 Item Details
              </Typography>
              <Box>
                <IconButton onClick={() => loadItemData(itemId)} size="small" sx={{ mr: 1 }}>
                  <RefreshIcon />
                </IconButton>
                <Button size="small" onClick={handleReset}>
                  New Scan
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Item Name
                        </Typography>
                        <Typography variant="h6">
                          {itemData.displayName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {itemData.itemName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Location & Type
                        </Typography>
                        <Typography variant="body1">
                          {itemData.location}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {itemData.type}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {itemData.bins.map((bin) => (
                <Grid item xs={12} md={6} key={bin.binId}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderColor: bin.binId === binId ? "primary.main" : "divider",
                      bgcolor: bin.binId === binId ? "primary.50" : "background.paper",
                      height: "100%"
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <InventoryIcon color={bin.binId === binId ? "primary" : "action"} />
                          <Typography variant="h6">
                            {bin.binId} {bin.binId === binId && "(Active)"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Max: {bin.maxQuantity}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h3" sx={{ my: 2, textAlign: "center" }}>
                        {bin.quantity}
                      </Typography>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={(bin.quantity / bin.maxQuantity) * 100}
                        color={
                          bin.quantity <= bin.maxQuantity * 0.2 ? "error" :
                          bin.quantity <= bin.maxQuantity * 0.5 ? "warning" : "success"
                        }
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption" color="textSecondary">
                          {bin.quantity}/{bin.maxQuantity}
                        </Typography>
                        <Typography variant="caption" color={
                          bin.quantity <= bin.maxQuantity * 0.2 ? "error.main" :
                          bin.quantity <= bin.maxQuantity * 0.5 ? "warning.main" : "success.main"
                        }>
                          {bin.maxQuantity - bin.quantity} needed
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Alert 
              severity="info" 
              sx={{ mt: 3 }}
              icon={<SwapHorizIcon />}
            >
              <Typography variant="body2">
                After reorder, active bin will switch from <strong>{binId}</strong> to{" "}
                <strong>{getAlternateBin()?.binId}</strong>
              </Typography>
            </Alert>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={handleBack}>
                Back to Scan
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Continue to Reorder
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && itemData && (
          <Box>
            <Typography variant="h5" gutterBottom>
              📝 Reorder Details
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                You will be redirected to NetSuite to authenticate and submit the purchase order.
                No app login required.
              </Typography>
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reorder Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  helperText={`Full bin: ${getActiveBin()?.maxQuantity} units`}
                  InputProps={{
                    inputProps: { min: 1, max: 1000 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  value={`$${itemData.unitPrice?.toFixed(2) || "0.00"}`}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Replenish BIN-A, Urgent order, Quality check needed"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Order Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Item:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">{itemData.displayName}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Current Bin:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">{binId}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">New Active Bin:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">{getAlternateBin()?.binId}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Quantity:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">{quantity} units</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Unit Price:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">${itemData.unitPrice?.toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Total:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">${calculateTotal()}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Vendor:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">{itemData.preferredVendor}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmitToNetSuite}
                disabled={!quantity || quantity < 1}
                sx={{ px: 4 }}
              >
                Submit to NetSuite
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="caption" color="textSecondary">
          Warehouse workers scan → Managers submit to NetSuite
        </Typography>
      </Box>
    </Container>
  );
}

export default ScanPage;