import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// GET 
export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    const { productId } = await params;
    try {


        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }
        // Fetch the product by ID

        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                productColors: { include: { color: true } },
                productSizes: { include: { size: true } },
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    const { storeId, productId } = await params;
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { name,
            price,
            quantity,
            categoryId,
            colorIds,
            sizeIds,
            images,
            description,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (quantity < 0) {
            return new NextResponse("Invalid quantity", { status: 400 });
        }


        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!colorIds || !colorIds.length) {
            return new NextResponse("Color IDs are required", { status: 400 });
        }

        if (!sizeIds || !sizeIds.length) {
            return new NextResponse("Size IDs are required", { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                quantity,
                categoryId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived,
                description,
                productColors: {
                    deleteMany: {},
                    createMany: {
                        data: colorIds.map((colorId: string) => ({ colorId }))
                    }
                },
                productSizes: {
                    deleteMany: {},
                    createMany: {
                        data: sizeIds.map((sizeId: string) => ({ sizeId }))
                    }
                }
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: productId,
            },
            data: {
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => image)
                    }
                }
            },
            include: {
                images: true,
                category: true,
                productColors: { include: { color: true } },
                productSizes: { include: { size: true } },
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_PATCH]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// DELETE request to delete a product

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    const { storeId, productId } = await params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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

        // Delete the product
        // Using deleteMany to ensure it works even if the product is not found
        const product = await prismadb.product.deleteMany({
            where: {
                id: productId,
            },
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_DELETE]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}