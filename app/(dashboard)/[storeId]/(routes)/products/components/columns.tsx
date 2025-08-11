"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  isFeatured: boolean;
  isArchived: boolean;
  description: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <div
          className="ml-5 mr-7 w-[400px]"
          style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => (
      <span className="text-xs text-gray-400">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const colors = row.original.color.split(",").map((c) => c.trim());
      return (
        <div className="flex items-center gap-x-2 flex-col gap-3">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-x-1">
              <div
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
