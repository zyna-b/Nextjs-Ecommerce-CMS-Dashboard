import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { storeId } = await params;
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

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!quantity && quantity < 0) {
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
        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name: name,
                price: price,
                quantity: quantity,
                description: description,
                isFeatured: isFeatured,
                isArchived: isArchived,
                categoryId: categoryId,
                storeId: storeId,
                // Create images for the product
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ]
                    },
                },
                productColors: {
                    create: colorIds.map((colorId: string) => ({
                        color: {
                            connect: { id: colorId }
                        }
                    })),
                },
                productSizes: {
                    create: sizeIds.map((sizeId: string) => ({
                        size: {
                            connect: { id: sizeId }
                        }
                    })),
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_POST]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}

// GET request to fetch all products for a specific store

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { storeId } = await params;
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const isFeatured = searchParams.get("isFeatured");


        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                productColors: { include: { color: true } },
                productSizes: { include: { size: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log("[PRODUCT_GET]: ", error);
        return new NextResponse("Internal error ", { status: 500 });
    }
}