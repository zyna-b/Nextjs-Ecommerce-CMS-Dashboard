import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: { storeId: string }} 
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { storeId } = await params;
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // Check if the store belongs to the user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userID: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const category = await prismadb.category.create({
            data: {
                name: name,
                billboardId: billboardId,
                storeId: storeId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_POST]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// GET request to fetch all categories for a specific store

export async function GET(
    req: Request,
    {params}: {params: { storeId: string }} 
) {
    const { storeId } = await params;
    try {

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: storeId,
            },
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log("[CATEGORY_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
} 