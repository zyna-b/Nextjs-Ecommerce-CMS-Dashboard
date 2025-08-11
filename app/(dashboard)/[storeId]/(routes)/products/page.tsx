import React from "react";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetching data for the Products page

  const { storeId } = await params;
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      category: true,
      productColors: { include: { color: true } },
      productSizes: { include: { size: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price),
    category: product.category.name,
    size: product.productSizes
      .map((ps) => ps.size?.name)
      .filter(Boolean)
      .join(", "),
    color: product.productColors
      .map((pc) => pc.color?.value)
      .filter(Boolean)
      .join(", "),
    quantity: product.quantity,
    description: product.description,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
