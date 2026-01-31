import React, { FC } from "react";
import { Product } from "../models/Product";
import "../css/ProductCard.css";

interface ProductCardProps {
  product: Product;
  onConfirm?: () => void;
}

//Each product card showes individual product details
const ProductCard: FC<ProductCardProps> = ({ product, onConfirm }) => {
  return (
    <div className="product-card">
      <div className="product-card-header">
        <h3>{product.product_name}</h3>
      </div>

      <div className="product-card-details">
        <ul>
          <li><strong>ID:</strong> {product.product_id}</li>
          <li><strong>Stock:</strong> {product.stock}</li>
          <li><strong>Reorder Point:</strong> {product.reorder_point}</li>
        </ul>

        {product.stock <= product.reorder_point && (
          <p className="alert">ALERT: Reorder Required!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
