import ModalButton from "@/components/modal-button";
import db from "@/lib/db";
import formatToWon from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getProducts(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  console.log(product);
  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProducts(id);
  if (!product) {
    return notFound();
  }

  return (
    <div className="absolute flex justify-center items-center z-50 w-full h-full bg-black bg-opacity-50 left-0 top-0">
      <ModalButton />

      <div className="max-w-screen-sm h-1/2 flex justify-center w-full bg-neutral-50 *:text-neutral-900">
      <div className="relative aspect-square">
          <Image
            fill
            src={product.photo}
            alt={product.title}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
            {" "}
            <div className="size-10 rounded-full overflow-hidden">
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <h3>{product.user.username}</h3>
          </div>
          <div className="p-5">
            <h1 className="text-xl font-semibold">{product.title}</h1>
            <span className="font-semibold text-xl">
             {formatToWon(product.price)}원
            </span>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
