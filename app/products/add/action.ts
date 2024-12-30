'use server'

import { z } from "zod";
import fs from "fs/promises"
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
    photo: z.string({
        required_error: "Photo is required"
    }),
    title: z.string({
        required_error: "Title is required"
    }),
    description: z.string({
        required_error: "Description is required"
    }),
    price: z.preprocess((val) => parseFloat(val as string), z.number({
        required_error: "Price is required",
        invalid_type_error: "Price is must be a number"
    })),

})

export async function uploadProduct(prevState: any, formData: FormData) {
    const data = {
        title: formData.get("title"),
        photo: formData.get("photo"),
        price: formData.get("price"),
        description: formData.get("description")
    };
    console.log("data:", data);

    if (data.photo instanceof File) {
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
        data.photo = `/${data.photo.name}`;
    }

    const result = productSchema.safeParse(data);

    if (!result.success) {
        console.error("Validation errors:", result.error.flatten());
        return result.error.flatten();
    } else {
        console.log("Validation passed, creating product...")
        const session = await getSession();
        if (session.id) {
                const product = await db.product.create({
                    data: {
                        title: result.data.title,
                        description: result.data.description,
                        price: result.data.price,
                        photo: result.data.photo,
                        user: {
                            connect: {
                                id: session.id
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                });
                redirect(`/products/${product.id}`);

        }
    }
}
