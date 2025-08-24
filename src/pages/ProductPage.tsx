import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Product, ProductsResponse } from "../types/api";
import { productsApi } from "../services/api";
import { ProductGrid } from "../components/ProductGrid";
import { Pagination } from "../components/Pagination";
import { useToastContext } from "../contexts/ToastContext";

const ITEMS_PER_PAGE = 20;

export const ProductPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToastContext();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response: ProductsResponse;

        if (searchQuery.trim()) {
          response = await productsApi.searchProducts(
            searchQuery,
            (currentPage - 1) * ITEMS_PER_PAGE,
            ITEMS_PER_PAGE
          );
        } else {
          response = await productsApi.getProducts(
            (currentPage - 1) * ITEMS_PER_PAGE,
            ITEMS_PER_PAGE
          );
        }

        setProducts(response.products);
        setTotalProducts(response.total);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, currentPage]);

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startProduct = (currentPage - 1) * ITEMS_PER_PAGE;
  const endProduct = Math.min(startProduct + ITEMS_PER_PAGE, totalProducts);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        {searchQuery ? (
          <>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              Discover amazing products at great prices
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Welcome to Our Store
            </h1>
            <p className="text-gray-600">
              Discover amazing products at great prices
            </p>
          </>
        )}
      </div>

      {/* Product Grid */}
      <div className="mb-8">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {!isLoading && totalProducts > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalProducts={totalProducts}
          startProduct={startProduct}
          endProduct={endProduct}
        />
      )}
    </div>
  );
};
