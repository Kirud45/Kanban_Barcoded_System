import React, { useState } from "react";
import { Product } from "../models/Product";
import ProductCard from "./ProductCard";
import QRCode from "react-qr-code";

interface ScanProductProps {
  inventory: Product[];
  onUpdateProduct: (updatedProduct: Product) => void;
}

const ScanProduct: React.FC<ScanProductProps> = ({ inventory, onUpdateProduct }) => {
  const [scanId, setScanId] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScanId(e.target.value);
  };

  const scanFunc = () => {
    const product = inventory.find((p) => p.product_id === scanId.trim());
    if (!product) {
      alert("Product not found!");
      setCurrentProduct(null);
      return;
    }
    setCurrentProduct(product);
  };

  //Decrease Stock
  const decreaseBtn = () => {
    if (!currentProduct || currentProduct.stock <= 0) return;

    const updatedProduct = {
      ...currentProduct,
      stock: currentProduct.stock - 1
    };

    setCurrentProduct(updatedProduct);
    onUpdateProduct(updatedProduct);
  };

  //Increase Stock
  const increaseBtn = () => {
    if (!currentProduct) return;
    const updatedProduct = { ...currentProduct, stock: currentProduct.stock + 1 };
    setCurrentProduct(updatedProduct);
    onUpdateProduct(updatedProduct);
  };

  //Just clears the current product and exits
  const exitBtn = () => {
    setCurrentProduct(null);
    setScanId("");
  };

  return (
    <div>
      <h2>Scanning Process (Simulation)</h2>
      <input
        type="text"
        value={scanId}
        placeholder="Enter Product ID"
        onChange={handleChange}
      />
      <button onClick={scanFunc}>Scan</button>

      {currentProduct && (
        <div className="product-card-container" style={{ flexDirection: "column", alignItems: "center" }}>
          <ProductCard product={currentProduct} />

      <div style={{ marginTop: "10px" }}>
        <QRCode value={JSON.stringify({
          id: currentProduct.product_id,
          name: currentProduct.product_name,
          stock: currentProduct.stock
        })} size={128} />
      </div>


          <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={decreaseBtn}>Decrease Stock</button>
            <button onClick={increaseBtn}>Increase Stock</button>
            <button onClick={exitBtn}>Exit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanProduct;
