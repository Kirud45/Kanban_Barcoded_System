/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log', 'N/runtime', 'N/error'], 
function(record, search, log, runtime, error) {
    
    /**
     * Suitelet entry point
     */
    function onRequest(context) {
        try {
            var request = context.request;
            var response = context.response;
            
            // Set CORS headers for external access
            response.setHeader({
                name: 'Access-Control-Allow-Origin',
                value: '*'
            });
            
            response.setHeader({
                name: 'Access-Control-Allow-Methods',
                value: 'GET, POST, OPTIONS'
            });
            
            response.setHeader({
                name: 'Access-Control-Allow-Headers',
                value: 'Content-Type'
            });
            
            // Handle OPTIONS preflight request
            if (request.method === 'OPTIONS') {
                response.write('OK');
                return;
            }
            
            // Only accept GET requests
            if (request.method !== 'GET') {
                writeError(response, 'Method not allowed. Use GET.');
                return;
            }
            
            // Get parameters from URL
            var params = request.parameters;
            
            log.audit('Suitelet Parameters', params);
            
            // Required parameters
            var itemId = params.itemId;
            var quantity = parseFloat(params.quantity);
            var binId = params.binId;
            var alternateBinId = params.alternateBinId;
            
            if (!itemId || !quantity || !binId || !alternateBinId) {
                writeError(response, 'Missing required parameters: itemId, quantity, binId, alternateBinId');
                return;
            }
            
            // Create purchase order
            var poResult = createPurchaseOrder({
                itemId: itemId,
                itemName: params.itemName || 'Unknown Item',
                quantity: quantity,
                vendorId: params.vendorId || getDefaultVendor(),
                vendorName: params.vendorName || 'Default Vendor',
                location: params.location || 'Main Warehouse',
                unitPrice: parseFloat(params.unitPrice) || 0,
                notes: params.notes || 'Kanban reorder',
                binId: binId,
                alternateBinId: alternateBinId,
                currentQuantity: parseFloat(params.currentQuantity) || 0,
                maxQuantity: parseFloat(params.maxQuantity) || 50
            });
            
            // Update bin status (switch active bin)
            updateBinStatus({
                itemId: itemId,
                currentBinId: binId,
                newActiveBinId: alternateBinId,
                location: params.location || 'Main Warehouse'
            });
            
            // Log the action
            logActivity({
                itemId: itemId,
                itemName: params.itemName,
                quantity: quantity,
                binId: binId,
                alternateBinId: alternateBinId,
                poNumber: poResult.poNumber,
                userId: runtime.getCurrentUser().id
            });
            
            // Return success response
            var returnUrl = params.returnUrl || 'https://your-kanban-app.com/scan?success=true';
            
            // Redirect to return URL or show success message
            if (returnUrl.includes('http')) {
                response.sendRedirect(returnUrl);
            } else {
                writeSuccess(response, {
                    success: true,
                    message: 'Purchase order created successfully',
                    poNumber: poResult.poNumber,
                    poId: poResult.poId,
                    itemId: itemId,
                    quantity: quantity,
                    binSwitched: binId + ' -> ' + alternateBinId,
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (e) {
            log.error('Suitelet Error', e);
            writeError(response, 'Error processing request: ' + e.message);
        }
    }
    
    /**
     * Create a purchase order in NetSuite
     */
    function createPurchaseOrder(data) {
        try {
            log.audit('Creating Purchase Order', data);
            
            // Create purchase order record
            var poRecord = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true
            });
            
            // Set basic fields
            poRecord.setValue({
                fieldId: 'entity',
                value: data.vendorId
            });
            
            poRecord.setValue({
                fieldId: 'location',
                value: getLocationId(data.location)
            });
            
            poRecord.setValue({
                fieldId: 'custbody_kanban_reorder',
                value: true
            });
            
            poRecord.setValue({
                fieldId: 'custbody_bin_id',
                value: data.binId
            });
            
            poRecord.setValue({
                fieldId: 'custbody_alternate_bin_id',
                value: data.alternateBinId
            });
            
            poRecord.setValue({
                fieldId: 'memo',
                value: data.notes + ' | Current Qty: ' + data.currentQuantity + '/' + data.maxQuantity
            });
            
            // Add item line
            poRecord.selectNewLine({
                sublistId: 'item'
            });
            
            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: getItemInternalId(data.itemId)
            });
            
            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: data.quantity
            });
            
            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                value: data.unitPrice
            });
            
            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_bin_number',
                value: data.binId
            });
            
            poRecord.commitLine({
                sublistId: 'item'
            });
            
            // Save the purchase order
            var poId = poRecord.save();
            
            // Get the PO number
            var poNumber = poRecord.getValue({
                fieldId: 'tranid'
            });
            
            log.audit('Purchase Order Created', {
                poId: poId,
                poNumber: poNumber,
                item: data.itemName,
                quantity: data.quantity
            });
            
            return {
                poId: poId,
                poNumber: poNumber
            };
            
        } catch (e) {
            log.error('Error creating purchase order', e);
            throw e;
        }
    }
    
    /**
     * Update bin status - switch active bin
     */
    function updateBinStatus(data) {
        try {
            log.audit('Updating Bin Status', data);
            
            // This would typically update a custom record or field
            // that tracks which bin is currently active for each item
            
            // Example: Update a custom field on the item record
            var itemRecord = record.load({
                type: record.Type.INVENTORY_ITEM,
                id: getItemInternalId(data.itemId)
            });
            
            // Set custom field for active bin
            itemRecord.setValue({
                fieldId: 'custitem_active_bin',
                value: data.newActiveBinId
            });
            
            itemRecord.save();
            
            log.audit('Bin Status Updated', {
                itemId: data.itemId,
                oldBin: data.currentBinId,
                newBin: data.newActiveBinId
            });
            
            // You might also want to create an inventory adjustment
            // or update bin quantities here
            
        } catch (e) {
            log.error('Error updating bin status', e);
            // Don't throw - we don't want to fail the whole process
            // if bin update fails
            log.audit('Bin update failed, continuing', e.message);
        }
    }
    
    /**
     * Log the activity for audit trail
     */
    function logActivity(data) {
        try {
            // Create custom record for audit trail
            var auditRecord = record.create({
                type: 'customrecord_kanban_audit', // Create this custom record in NetSuite
                isDynamic: true
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_item',
                value: data.itemId
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_item_name',
                value: data.itemName
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_quantity',
                value: data.quantity
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_bin_from',
                value: data.binId
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_bin_to',
                value: data.alternateBinId
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_po_number',
                value: data.poNumber
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_user',
                value: data.userId
            });
            
            auditRecord.setValue({
                fieldId: 'custrecord_kanban_timestamp',
                value: new Date()
            });
            
            auditRecord.save();
            
        } catch (e) {
            log.error('Error logging activity', e);
            // Non-critical - just log to system log
        }
    }
    
    /**
     * Helper: Get item internal ID from external ID or item number
     */
    function getItemInternalId(itemIdentifier) {
        try {
            // If it's already a numeric ID, return it
            if (!isNaN(itemIdentifier) && itemIdentifier.toString().indexOf('.') === -1) {
                return parseInt(itemIdentifier);
            }
            
            // Search for item by itemId (external ID) or item number
            var itemSearch = search.create({
                type: search.Type.INVENTORY_ITEM,
                filters: [
                    ['itemid', 'is', itemIdentifier]
                ],
                columns: ['internalid']
            });
            
            var result = itemSearch.run().getRange({ start: 0, end: 1 });
            
            if (result && result.length > 0) {
                return result[0].getValue('internalid');
            }
            
            // Try by item name
            itemSearch = search.create({
                type: search.Type.INVENTORY_ITEM,
                filters: [
                    ['displayname', 'contains', itemIdentifier]
                ],
                columns: ['internalid']
            });
            
            result = itemSearch.run().getRange({ start: 0, end: 1 });
            
            if (result && result.length > 0) {
                return result[0].getValue('internalid');
            }
            
            throw error.create({
                name: 'ITEM_NOT_FOUND',
                message: 'Item not found: ' + itemIdentifier
            });
            
        } catch (e) {
            log.error('Error getting item internal ID', e);
            throw e;
        }
    }
    
    /**
     * Helper: Get location internal ID
     */
    function getLocationId(locationName) {
        try {
            var locationSearch = search.create({
                type: search.Type.LOCATION,
                filters: [
                    ['name', 'is', locationName]
                ],
                columns: ['internalid']
            });
            
            var result = locationSearch.run().getRange({ start: 0, end: 1 });
            
            if (result && result.length > 0) {
                return result[0].getValue('internalid');
            }
            
            // Return default location if specified not found
            return 1; // Default location ID
            
        } catch (e) {
            log.error('Error getting location ID', e);
            return 1; // Default location ID
        }
    }
    
    /**
     * Helper: Get default vendor ID
     */
    function getDefaultVendor() {
        // You might want to configure this in a custom preference
        // or get it from the item's preferred vendor
        return 1; // Default vendor ID
    }
    
    /**
     * Write JSON success response
     */
    function writeSuccess(response, data) {
        response.setHeader({
            name: 'Content-Type',
            value: 'application/json'
        });
        response.write(JSON.stringify(data));
    }
    
    /**
     * Write JSON error response
     */
    function writeError(response, message) {
        response.setHeader({
            name: 'Content-Type',
            value: 'application/json'
        });
        response.write(JSON.stringify({
            success: false,
            error: message
        }));
    }
    
    return {
        onRequest: onRequest
    };
});