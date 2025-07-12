import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: { storeId: string }} 
) {
    const { storeId } = await params;
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
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

        const color = await prismadb.color.create({
            data: {
                name: name,
                value: value,
                storeId: storeId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_POST]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// GET request to fetch all colors for a specific store

export async function GET(
    req: Request,
    {params}: {params: { storeId: string }} 
) {
    const { storeId } = await params;
    try {

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId: storeId,
            },
        });

        return NextResponse.json(colors);

    } catch (error) {
        console.log("[COLOR_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}