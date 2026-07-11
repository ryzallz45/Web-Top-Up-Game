"use client";

import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (product: Product) => void;
}

export default function ProductList({ products, selectedId, onSelect }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-dark-500">Tidak ada nominal tersedia</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition-all",
            selectedId === product.id
              ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
              : "border-dark-200 hover:border-primary-300 hover:bg-dark-50"
          )}
        >
          <div className="text-sm font-semibold text-dark-900">{product.nominal}</div>
          {product.bonus && (
            <div className="mt-1 text-xs font-medium text-green-600">
              Bonus: {product.bonus}
            </div>
          )}
          <div className="mt-2">
            <span className="text-base font-bold text-primary-600">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-dark-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
