import React from "react";
import {format} from "date-fns";

import { ColorClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";

const ColorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

// Fetching data for the Colors page

const { storeId } = await params;
const colors = await prismadb.color.findMany({
  where: {
    storeId: storeId,
  },
  orderBy: {
    createdAt: "desc",
  }
});

const formattedColors: ColorColumn[] = colors.map((color) => ({
  id: color.id,
  name: color.name,
  value: color.value,
  createdAt: format(color.createdAt, "MMMM do, yyyy"),
}));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <ColorClient data={formattedColors}/>
      </div>
    </div>
  );
}; 

export default ColorsPage;
