import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {

    // Fetch all paid orders for the store
    // This assumes that the `isPaid` field indicates whether an order has been paid
    // and that each order has associated order items with product prices

    if (!storeId) {
        throw new Error("Store ID is required to fetch total revenue.");
    }

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId: storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            }
        },
    });

    // Calculate total revenue by summing the prices of all order items in paid orders
    // This assumes that each order item has a `product` with a `price` field
    if (!paidOrders || paidOrders.length === 0) {
        return 0;
    }
    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price;
        }, 0);

        return total + orderTotal;
    }, 0);
    return totalRevenue;
}


