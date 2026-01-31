import React, { useState } from "react";
import { Product } from "../models/Product";
import QRCode from "react-qr-code";

interface GenerateBarcodeProps {
  inventory: Product[];
}

const GenerateBarcode: React.FC<GenerateBarcodeProps> = ({ inventory }) => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);

  const generateBarcode = () => {
    const found = inventory.find(
      (p) => p.product_id === productId.trim()
    );

    if (!found) {
      alert("Product not found");
      setProduct(null);
      return;
    }

    setProduct(found);
  };

  return (
    <div>
      <h2>Generate Barcode</h2>

      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={generateBarcode}>Generate</button>

      {product && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h3>{product.product_name}</h3>
          <p>ID: {product.product_id}</p>

          <QRCode
            value={`PRODUCT:${product.product_id}`}
            size={160}
          />
        </div>
      )}
    </div>
  );
};

export default GenerateBarcode;
