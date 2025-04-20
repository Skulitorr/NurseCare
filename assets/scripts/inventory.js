/**
 * inventory.js - Advanced AI-powered inventory management functionality
 * NurseCare AI System
 */

// ===== INITIALIZATION & SETUP =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing enhanced inventory system...");
    
    // Initialize inventory specific functionality
    initInventory();
    
    // Set up event listeners
    setupInventoryEventListeners();
    
    // Initialize AI features
    initInventoryAI();
    
    // Show welcome message
    setTimeout(() => {
        showToast("Velkomin(n) í uppfærða birgðastjórnunarkerfið", "success", 3000);
    }, 1000);
});

/**
 * Initialize inventory page
 */
function initInventory() {
    // Load inventory data
    loadInventoryItems();
    
    // Initialize charts
    initInventoryCharts();
    
    // Update dashboard counters
    updateInventoryDashboard();
    
    // Set up search and filter functionality
    setupSearch();
    
    // Show initial AI insights
    generateAIInsights();
}

/**
 * Load inventory items from the system
 */
export function loadInventoryItems() {
    // This would typically fetch data from your backend
    // For now, we'll use mock data
    const mockItems = [
        {
            id: 1,
            name: "Hanskar (M)",
            category: "Hlífðarbúnaður",
            stock: 500,
            unit: "stk",
            minRequired: 200
        },
        {
            id: 2,
            name: "Grímur (Type IIR)",
            category: "Hlífðarbúnaður",
            stock: 1000,
            unit: "stk",
            minRequired: 500
        },
        {
            id: 3,
            name: "Sáraumbúðir 10x10cm",
            category: "Hjúkrun",
            stock: 150,
            unit: "stk",
            minRequired: 100
        }
    ];

    // Get the table body
    const tableBody = document.querySelector('.inventory-table tbody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add mock items to table
    mockItems.forEach(item => {
        const percentage = (item.stock / item.minRequired) * 100;
        let statusClass = 'status-ok';
        
        if (percentage <= 25) {
            statusClass = 'status-critical';
        } else if (percentage <= 50) {
            statusClass = 'status-low';
        }

        const row = document.createElement('tr');
        row.setAttribute('data-id', item.id);
        row.setAttribute('data-type', 'inventory');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock} ${item.unit}</td>
            <td>${item.minRequired} ${item.unit}</td>
            <td>
                <div class="status-bar">
                    <div class="status-fill ${statusClass}" style="width: ${Math.min(100, percentage)}%;"></div>
                </div>
            </td>
            <td class="actions-cell">
                <button class="action-btn" title="Breyta"><i class="fas fa-edit"></i></button>
                <button class="action-btn" title="Uppfæra birgðir"><i class="fas fa-sync-alt"></i></button>
                <button class="action-btn" title="Panta meira"><i class="fas fa-shopping-cart"></i></button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Set up action buttons for new rows
    setupItemActionButtons();
}

[Previous code continues unchanged...]