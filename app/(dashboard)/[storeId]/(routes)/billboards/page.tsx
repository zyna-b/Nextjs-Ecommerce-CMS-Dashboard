import React from "react";
import {format} from "date-fns";

import { BillboardClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {

// Fetching data for the Billboard page


const { storeId } = await params;
const billboards = await prismadb.billboard.findMany({
  where: {
    storeId: storeId,
  },
  orderBy: {
    createdAt: "desc",
  }
});

const formattedBillboards = billboards.map((billboard) => ({
  id: billboard.id,
  label: billboard.label,
  createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
}));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
  );
};

export default BillboardPage;
