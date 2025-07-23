import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

// ---------------------------------------------
// STEP 1: Define CORS headers for cross-origin access
// ---------------------------------------------
const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Allow all origins (change to your domain in production!)
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow these HTTP methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow these request headers
};

// ---------------------------------------------
// STEP 2: Handle Preflight OPTIONS Request
// ---------------------------------------------
// This is needed for CORS when the browser makes a "preflight" check (before POST)
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// ---------------------------------------------
// STEP 3: Handle Checkout POST Request
// ---------------------------------------------
// Triggered when the frontend wants to create a Stripe Checkout session
export async function POST(
    req: Request,
    { params }: { params: { storeId: string } } // Extract storeId from URL params (e.g., /api/checkout/:storeId)
) {
    // ---------------------------------------------
    // 3.1: Read productIds from the POST request body
    // ---------------------------------------------
    const { productIds } = await req.json(); // Expecting: { productIds: [id1, id2, ...] }

    // Validate: must include at least one product ID
    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product IDs are required", { status: 400, headers: corsHeaders });
    }

    // ---------------------------------------------
    // 3.2: Fetch products from your DB that match the productIds
    // ---------------------------------------------
    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds, // Match any product where the ID is in the productIds array
            }
        }
    });

    // ---------------------------------------------
    // 3.3: Prepare line_items array for Stripe Checkout
    // Each product gets converted into Stripe-compatible format
    // ---------------------------------------------
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
        line_items.push({
            quantity: 1, // Default quantity is 1 (you can extend this in future)
            price_data: {
                currency: "usd", // Price in USD
                product_data: {
                    name: product.name, // Product name shown in Stripe Checkout
                },
                unit_amount: product.price * 100, // Stripe expects price in cents → $10 = 1000
            },
        });
    });

    // ---------------------------------------------
    // 3.4: Extract the store ID from route params
    // ---------------------------------------------
    const storeID = await params.storeId;

    // ---------------------------------------------
    // 3.5: Create a new unpaid order in your database
    // Link all the selected products to this order
    // ---------------------------------------------
    const order = await prismadb.order.create({
        data: {
            storeId: storeID,
            isPaid: false, // Mark it unpaid initially
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: { id: productId }, // Link each product to the order
                    }
                })),
            }
        }
    });

    // ---------------------------------------------
    // 3.6: Create a Stripe Checkout Session
    // This will return a unique payment URL that the user will be redirected to
    // ---------------------------------------------
    const session = await stripe.checkout.sessions.create({
        line_items, // Products array formatted for Stripe
        mode: "payment", // One-time payment mode
        billing_address_collection: "required", // Require billing address from user
        phone_number_collection: {
            enabled: true, // Ask for phone number
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`, // Redirect after payment success
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`, // Redirect if user cancels payment
        metadata: {
            orderId: order.id, // Attach order ID so webhook can use it later to mark it paid
        }
    });

    // ---------------------------------------------
    // 3.7: Return the Stripe Checkout URL to the frontend
    // The frontend will redirect the user to this link
    // ---------------------------------------------
    return NextResponse.json(
        { url: session.url }, // JSON response: { url: "https://checkout.stripe.com/..." }
        { headers: corsHeaders } // Attach CORS headers to response
    );
}
