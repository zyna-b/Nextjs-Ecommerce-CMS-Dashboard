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

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        const { storeId } = await params;
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

        const billboard = await prismadb.billboard.create({
            data: {
                label: label,
                imageUrl: imageUrl,
                storeId: storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_POST]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// GET request to fetch all billboards for a specific store

export async function GET(
    req: Request,
    {params}: {params: { storeId: string }} 
) {
    try {
        const { storeId } = await params;
        
        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: storeId,
            },
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log("[BILLBOARD_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}