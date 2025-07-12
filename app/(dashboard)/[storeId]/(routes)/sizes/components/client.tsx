"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface SizeClientProps {
  data: SizeColumn[];
}

export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const storeId = params.storeId as string;

  return (
    <>
      <div className="m-10 flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* Data Table */}

      <DataTable searchKey="name" columns={columns} data={data} />

      <div className="m-10">
        <Heading title="API" description="API endpoints for sizes" />
        <div className="mb-6"></div>
        <ApiList entityName="sizes" entityIdName="sizeId" />
      </div>
    </>
  );
};
