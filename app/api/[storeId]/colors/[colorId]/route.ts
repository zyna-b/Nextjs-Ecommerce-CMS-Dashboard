import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// GET 
export async function GET(
    req: Request,
    { params }: { params: { colorId: string } }
) {
    const { colorId } = await params;   
    try {


        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }
        // Fetch the color by ID

        const color = await prismadb.color.findUnique({
            where: {
                id: colorId,
            },
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}



export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    const { storeId, colorId } = await params;
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

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: colorId,
            },
            data: {
                name: name,
                value: value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_PATCH]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// DELETE request to delete a color

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    const { storeId, colorId } = await params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        // Delete the color
        // Using deleteMany to ensure it works even if the color is not found
        const color = await prismadb.color.deleteMany({
            where: {
                id: colorId,
            },
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_DELETE]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}