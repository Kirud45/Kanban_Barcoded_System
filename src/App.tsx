import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import ScanProduct from "./components/ScanProduct";
import { Product } from "./models/Product";
import "./App.css"; // optional styling

const App: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);

  const handleLoadInventory = (products: Product[]) => {
    setInventory(products);
  };

  //When a product is updated; update the inventory state
  const handleUpdateProduct = (updatedProduct: Product) => {
    setInventory((prev) =>
      prev.map((p) => (p.product_id === updatedProduct.product_id ? updatedProduct : p))
    );
  };

  return (
    <div className="App">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-links">
          <a href="#">Home</a>
          <a href="#">Alerts</a>
          <a href="#">Generate Barcode</a>
        </div>
        <h1>Kanban Warehouse Inventory</h1>
      </header>

      <main style={{ padding: "20px", minHeight: "80vh" }}>
        {/* CSV Upload Section */}
        <section style={{ marginBottom: "30px" }}>
          <h2>Upload Inventory CSV</h2>
          <UploadCSV onLoadInventory={handleLoadInventory} />
        </section>

        {/* Scan Product Section */}
        {inventory.length > 0 && (
          <section style={{ marginBottom: "30px" }}>
            <h2>Scan Product</h2>
            <ScanProduct
              inventory={inventory}
              onUpdateProduct={handleUpdateProduct}
            />
          </section>
        )}

        {/* Inventory List Section */}
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
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; 2026 Barcoded Kanban Inventory System.
      </footer>
    </div>
  );
};

export default App;
