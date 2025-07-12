"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const storeId = params.storeId as string;

  return (
    <>
      <div className="m-10 flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* Data Table */}

      <DataTable searchKey="name" columns={columns} data={data} />

      <div className="m-10">
        <Heading title="API" description="API endpoints for categories" />
        <div className="mb-6"></div>
        <ApiList entityName="categories" entityIdName="categoryId" />
      </div>
    </>
  );
};
