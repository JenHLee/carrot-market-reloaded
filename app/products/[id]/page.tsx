import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToWon from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId; // true = this product's owner is current user
  }
  return false;
}

async function getProduct(id: number) {
  //   await new Promise((resolve) => setTimeout(resolve, 60000));

  console.log("product");
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
  // console.log(product);
  return product;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  // tages doesn't have to be unique, multiple tages, 여러 캐시에서 공유도 가능
  tags: ["product-detail", "xxxx"],
});

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxxx"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

// Page.tsx의 속성을 통해서 parameter object를 가지고 옴 (이때 사용하는 것은 url의 id) // products/[id] => products/1
// params.id = 1
// Next.js에게 URL에 있는 값을 ID로 주기를 원한다고 말했기 때문에
export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // params.id가 숫자가 아닐 경우를 대비하여, 이것을 숫자로 변경함.
  // 즉 params.id에 string을 입력할 경우 이것은 NaN이 됨
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  // Check isOwner => 편집, 삭제 등의 기능을 보여줄 수 있음
  const isOwner = await getIsOwner(product.userId);

  const revalidate = async() => {
    "use server";
    // 특정 path (url)의 cache를 새로고침 해달라고함
    revalidateTag("xxxx");
  }
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
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
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate product
            </button>
          </form>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
