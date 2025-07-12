import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const { storeId } = await params;

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userID: userId
            },
            data: {
                name: name
            }
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORES_PATCH]: ", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Delete function


export async function DELETE(
    _req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const storeId = await params.storeId;
        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }
        
        const store = await prismadb.store.deleteMany({
            where: {
                id: storeId,
                userID: userId
            }
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORES_DELETE]: ", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


    