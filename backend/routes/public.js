const express = require('express');
const router = express.Router();
const netsuiteService = require('../services/netsuite');

// @route   GET /api/public/items/:id
// @desc    Get public item info for scanning
// @access  Public
router.get('/items/:id', async (req, res) => {
  try {
    const item = await netsuiteService.getItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Return only public info (no sensitive data)
    const publicItem = {
      id: item.id,
      itemName: item.itemName,
      displayName: item.displayName,
      type: item.type,
      location: item.location,
      bins: item.bins,
      reorderPoint: item.reorderPoint
    };
    
    res.json({
      success: true,
      data: publicItem
    });
  } catch (error) {
    console.error('Get public item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item'
    });
  }
});

// @route   GET /api/public/barcode-url/:id
// @desc    Generate barcode URL for item
// @access  Public
router.get('/barcode-url/:id', async (req, res) => {
  try {
    const item = await netsuiteService.getItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Determine which bin is active (the one with lower quantity)
    const activeBin = item.bins.reduce((prev, current) => 
      (prev.quantity < current.quantity) ? prev : current
    );
    
    const barcodeUrl = `${process.env.FRONTEND_URL}/scan?itemId=${item.id}&binId=${activeBin.binId}&location=${item.location}`;
    
    res.json({
      success: true,
      data: {
        url: barcodeUrl,
        itemName: item.itemName,
        displayName: item.displayName,
        activeBin
      }
    });
  } catch (error) {
    console.error('Get barcode URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating barcode URL'
    });
  }
});

module.exports = router;