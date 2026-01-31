// src/App.tsx
import React, { useState, useEffect } from "react";
import UploadCSV from "./components/UploadCSV";
import ScanProduct from "./components/ScanProduct";
import { Product } from "./models/Product";
import GenerateBarcode from "./pages/GenerateBarcode";
import "./App.css";

const App: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<"home" | "alerts" | "barcode">("home");

  //Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  //Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  //When a product is updated
  const handleUpdateProduct = (updatedProduct: Product) => {
    setInventory((prev) =>
      prev.map((p) => (p.product_id === updatedProduct.product_id ? updatedProduct : p))
    );
  };

  const handleLoadInventory = (products: Product[]) => {
    setInventory(products);
  };

  return (
    <div className="App">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-links">
          <button onClick={() => setCurrentPage("home")}>Home</button>
          <button onClick={() => setCurrentPage("alerts")}>Alerts</button>
          <button onClick={() => setCurrentPage("barcode")}>Generate Barcode</button>
        </div>
        <h1>Kanban Warehouse Inventory</h1>
      </header>

      <main style={{ padding: "20px", minHeight: "80vh" }}>

        {currentPage === "home" && (
          <>
            <section style={{ marginBottom: "30px" }}>
              <h2>Upload Inventory CSV</h2>
              <UploadCSV onLoadInventory={handleLoadInventory} />
            </section>

            {inventory.length > 0 && (
              <section style={{ marginBottom: "30px" }}>
                <h2>Scan Product</h2>
                <ScanProduct
                  inventory={inventory}
                  onUpdateProduct={handleUpdateProduct}
                />
              </section>
            )}

            {inventory.length > 0 && (
              <section style={{ marginBottom: "30px" }}>
                <h2>Inventory Product List</h2>
                <ul>
                  {inventory.map((p) => (
                    <li key={p.product_id}>
                      {p.product_name} (ID: {p.product_id}) - Stock: {p.stock}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {/* Alerts Page */}
        {currentPage === "alerts" && (
          <section>
            <h2>Alerts</h2>
            {inventory.filter((p) => p.stock <= p.reorder_point).length === 0 ? (
              <p>No alerts! All products are above reorder point.</p>
            ) : (
              <ul>
                {inventory
                  .filter((p) => p.stock <= p.reorder_point)
                  .map((p) => (
                    <li key={p.product_id}>
                      ⚠ {p.product_name} (ID: {p.product_id}) - Stock: {p.stock} (Reorder: {p.reorder_point})
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}

        {/* Generate Barcode Page */}
        {currentPage === "barcode" && (
          <section>
            <h2>Generate Barcode</h2>
            {/* Generate Barcode Page */}
            {currentPage === "barcode" && (
              <section>
                <GenerateBarcode inventory={inventory} />
              </section>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; 2026 Barcoded Kanban Inventory System.
      </footer>
    </div>
  );
};

export default App;
