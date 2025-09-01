import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Inventory.css";

const initialItems = [];
const lowStockThreshold = 10;

function Inventory({ setActivePage, activePage, sidebarOpen, setSidebarOpen, inventory, setInventory }) {
  const [items, setItems] = useState(inventory);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    expiry: "",
    category: "Medicine",
  });

  const [showReport, setShowReport] = useState(false);

  // Sync local state with global inventory state
  useEffect(() => {
    setItems(inventory);
  }, [inventory]);

  // Update global state when local state changes
  useEffect(() => {
    setInventory(items);
  }, [items, setInventory]);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddOrUpdate(e) {
    e.preventDefault();
    // Validate quantity is a positive integer
    const quantity = parseInt(form.quantity, 10);
    if (
      form.name.trim() &&
      !isNaN(quantity) &&
      quantity >= 0 &&
      form.expiry &&
      form.category
    ) {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: form.name.trim(),
          quantity,
          expiry: form.expiry,
          category: form.category,
        },
      ]);
      setForm({ name: "", quantity: "", expiry: "", category: "Medicine" });
      setShowForm(false);
    } else {
      alert("Please fill all fields correctly. Quantity must be a non-negative number.");
    }
  }

  function adjustStock(id, amount) {
    setItems(items.map(item => (
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + amount) }
        : item
    )));
  }

  // Filter and search logic
  const filteredItems = items.filter(item =>
    (filter === "All" || item.category === filter) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Expired and monthly usage for reports
  const expiredItems = items.filter(item =>
    item.expiry && new Date(item.expiry) < new Date()
  );
  const monthlyUsage = items.filter(item =>
    item.expiry &&
    new Date(item.expiry).getMonth() === new Date().getMonth()
  );
  
  // Medicine statistics
  const totalMedicines = items.filter(item => item.category === "Medicine").length;
  const availableMedicines = items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").length;
  const shortageMedicines = items.filter(item => item.quantity <= lowStockThreshold && item.category === "Medicine").length;

  return (
    <div className="clinic-dashboard-root">
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        onSidebarToggle={setSidebarOpen}
        isOpen={sidebarOpen}
      />
      <main className={`inventory-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="inventory-header">
          <h1 className="inventory-title">Inventory</h1>
          <div className="inventory-actions">
            <button className="inventory-btn" onClick={() => setShowForm(true)}>Add Item</button>
            <button className="inventory-btn" onClick={() => setShowReport(!showReport)}>View Reports</button>
          </div>
        </div>
        <div className="inventory-controls">
          <input
            type="text"
            className="inventory-search"
            placeholder="Search item name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="inventory-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Medicine">Medicine</option>
            <option value="Equipment">Equipment</option>
            <option value="Supplies">Supplies</option>
          </select>
        </div>

        {/* Medicine Statistics Summary */}
        <div className="inventory-stats-summary">
          <div className="stat-item">
            <span className="stat-number">{totalMedicines}</span>
            <span className="stat-label">Total Medicines</span>
          </div>
          <div className="stat-item">
            <span className="stat-number available">{availableMedicines}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number shortage">{shortageMedicines}</span>
            <span className="stat-label">Shortage</span>
          </div>
        </div>

        {/* Medical Shortage and Available Medicines Section */}
        <div className="inventory-summary-cards">
          <div className="inventory-summary-card shortage-card">
            <div className="summary-card-header">
              <h3>Medical Shortage</h3>
              <span className="shortage-count">{items.filter(item => item.quantity <= lowStockThreshold && item.category === "Medicine").length}</span>
            </div>
            <div className="summary-card-content">
              {items.filter(item => item.quantity <= lowStockThreshold && item.category === "Medicine").length > 0 ? (
                <ul className="shortage-list">
                  {items.filter(item => item.quantity <= lowStockThreshold && item.category === "Medicine").map(item => (
                    <li key={item.id} className="shortage-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-shortage">No medicine shortages</p>
              )}
            </div>
          </div>

          <div className="inventory-summary-card available-card">
            <div className="summary-card-header">
              <h3>Available Medicines</h3>
              <span className="available-count">{items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").length}</span>
            </div>
            <div className="summary-card-content">
              {items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").length > 0 ? (
                <ul className="available-list">
                  {items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").slice(0, 5).map(item => (
                    <li key={item.id} className="available-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </li>
                  ))}
                  {items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").length > 5 && (
                    <li className="more-items">+{items.filter(item => item.quantity > lowStockThreshold && item.category === "Medicine").length - 5} more</li>
                  )}
                </ul>
              ) : (
                <p className="no-available">No medicines available</p>
              )}
            </div>
          </div>
        </div>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Category</th>
              <th>Stock Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No items found.</td>
              </tr>
            )}
            {filteredItems.map(item => (
              <tr key={item.id} className={item.quantity <= lowStockThreshold ? "low-stock" : ""}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.expiry}</td>
                <td>{item.category}</td>
                <td>
                  <button className="inventory-adjust" onClick={() => adjustStock(item.id, 1)}>+</button>
                  <button className="inventory-adjust" onClick={() => adjustStock(item.id, -1)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Add/Update Item Form */}
        {showForm && (
          <div className="inventory-modal">
            <div className="inventory-modal-content">
              <h2>Add/Update Item</h2>
              <form onSubmit={handleAddOrUpdate}>
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  min="0"
                  value={form.quantity}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="date"
                  name="expiry"
                  placeholder="Expiry Date"
                  value={form.expiry}
                  onChange={handleFormChange}
                  required
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Medicine">Medicine</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplies">Supplies</option>
                </select>
                <div className="inventory-modal-actions">
                  <button type="submit" className="inventory-btn">Save</button>
                  <button type="button" className="inventory-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Reports Section */}
        {showReport && (
          <div className="inventory-modal">
            <div className="inventory-modal-content">
              <h2>Reports</h2>
              <h4>Expired Items</h4>
              <ul>
                {expiredItems.length === 0
                  ? <li>No expired items.</li>
                  : expiredItems.map(item => (
                    <li key={item.id}>{item.name} (expired on {item.expiry})</li>
                  ))
                }
              </ul>
              <h4>Items Expiring This Month</h4>
              <ul>
                {monthlyUsage.length === 0
                  ? <li>No items expiring this month.</li>
                  : monthlyUsage.map(item => (
                    <li key={item.id}>{item.name} (expires on {item.expiry})</li>
                  ))
                }
              </ul>
              <button className="inventory-btn" onClick={() => setShowReport(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Inventory;