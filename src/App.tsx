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
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Kanban Warehouse Inventory</h1>

      {/*CSV Upload*/}
      <UploadCSV onLoadInventory={handleLoadInventory} />

      {/*Scan Product*/}
      {inventory.length > 0 && (
        <ScanProduct inventory={inventory} onUpdateProduct={handleUpdateProduct} />
      )}

     
      {inventory.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Inventory Product List</h2>
          <ul>
            {inventory.map((p) => (
              <li key={p.product_id}>
                {p.product_name} (ID: {p.product_id}) - Stock: {p.stock}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
