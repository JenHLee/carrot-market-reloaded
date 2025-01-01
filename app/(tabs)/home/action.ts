'use server'
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        // page is 0 * 1 => 0씩 스킵 즉 스킵 X
        // page is 1 * 1 => 1씩 스킵
        // page is 2 * 1 => 2씩 스킵
        skip: page * 1,
        take: 1,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}