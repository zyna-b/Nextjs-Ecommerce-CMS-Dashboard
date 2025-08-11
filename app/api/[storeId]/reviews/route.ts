import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    try {

        if (!params.storeId) {
            return NextResponse.json({ error: "Missing store ID" }, { status: 400 });
        }

        const body = await req.json();
        const { productId, comment, rating, userEmail, userName, userId } = body;


        if (!productId || !comment || !rating || !userEmail || !userName || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingReview = await prismadb.review.findFirst({
            where: {
                productId,
                userId,
            },
        });

        if (existingReview) {
            return NextResponse.json({ error: "Review already exists for this product by this user" }, { status: 400 });
        }
        // Create the review
        const review = await prismadb.review.create({
            data: {
                productId,
                comment,
                rating: Number(rating),
                userEmail,
                userName,
                userId
            },
        });
        
        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { storeId } = await params;

        if (!storeId) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");


        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const reviews = await prismadb.review.findMany({
            where: {
                productId: productId,
                product: { storeId: storeId }
            },
            include: { product: true }
        });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.log("[REVIEWS_GET]: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}