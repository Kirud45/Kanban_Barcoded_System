import React from "react";
import Papa from "papaparse";
import { Product } from "../models/Product";

interface UploadCSVProps {
  onLoadInventory: (products: Product[]) => void;
}

const UploadCSV: React.FC<UploadCSVProps> = ({ onLoadInventory }) => {

  const parseProduct = (row: any): Product => ({
    product_id: row.product_id,
    product_name: row.product_name,
    product_line: row.product_line || "",
    stock: Number(row.stock),
    reorder_point: Number(row.reorder_point)
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      alert("Please select a CSV file to upload!");
      return;
    }

    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const products = results.data.map(parseProduct);
        console.log("CSV loaded:", products);
        onLoadInventory(products);
        alert(`CSV loaded! ${products.length} products available.`);
      },
    });
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFile} />
    </div>
  );
};

export default UploadCSV;
