import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// GET 
export async function GET(
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {


        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }
        // Fetch the size by ID

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}



export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
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

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        // Check if the store belongs to the user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userID: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name: name,
                value: value
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_PATCH]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// DELETE request to delete a size

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    const { storeId, sizeId } = await params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
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

        // Delete the size
        // Using deleteMany to ensure it works even if the size is not found
        const size = await prismadb.size.deleteMany({
            where: {
                id: sizeId,
            },
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_DELETE]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}