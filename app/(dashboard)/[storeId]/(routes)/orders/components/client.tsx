"use client";

import React from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="m-10">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
        <div className="m-4"></div>
        <Separator />
      </div>

      {/* Data Table */}

      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};
