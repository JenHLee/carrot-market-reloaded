import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  // not meaning every 60sec
  // after 60 sec
  //함수가 호출 된 뒤 재 호출했을때 60초 이전이면 caching된 data반환, 60초 이후면 너무 오래되었다고 간주하고 다시 fetch하고 새로운 data를 가지고 옴
  revalidate: 60,
});

async function getInitialProducts() {
  console.log("hit");
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

export default async function Products() {
  const initialProducts = await getCachedProducts();
  const revalidate = async() => {
    "use server";
    // 특정 path (url)의 cache를 새로고침 해달라고함
    revalidatePath("/home");
  }

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center size-16 rounded-full bottom-24 fixed right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
