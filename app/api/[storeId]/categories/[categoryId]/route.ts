import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// GET 
export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    const { categoryId } = await params;
    try {


        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }
        // Fetch the category by ID

        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                billboard: true, // Include the billboard details
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}



export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    const { storeId, categoryId } = await params;
    try {
        const { userId } = await auth();
        const body = await req.json();

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

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: categoryId,
            },
            data: {
                name: name,
                billboardId: billboardId,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_PATCH]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// DELETE request to delete a category

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    const { storeId, categoryId } = await params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        // Delete the category
        // Using deleteMany to ensure it works even if the category is not found
        const category = await prismadb.category.deleteMany({
            where: {
                id: categoryId,
            },
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_DELETE]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}