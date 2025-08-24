import React from "react";
import { Product } from "../types/api";
import { useCart } from "../contexts/CartContext";
import { BsCart3 } from "react-icons/bs";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const BsCart3Icon = BsCart3 as unknown as React.ComponentType<any>;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-purple-600">
              $
              {(product.price * (1 - product.discountPercentage / 100)).toFixed(
                2
              )}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {product.stock} left in stock
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full gradient-bg text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
        >
          <BsCart3Icon style={{ fontSize: 20 }} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
