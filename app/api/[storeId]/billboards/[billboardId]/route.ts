import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// GET 
export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {

        const { billboardId } = await params;

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }
        // Fetch the billboard by ID

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
            },
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}



export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {

    const { storeId, billboardId } = await params;
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

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId,
            },
            data: {
                label: label,
                imageUrl: imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_PATCH]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// DELETE request to delete a billboard

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    const { storeId, billboardId } = await params;
    
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        // Delete the billboard
        // Using deleteMany to ensure it works even if the billboard is not found
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: billboardId,
            },
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_DELETE]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}