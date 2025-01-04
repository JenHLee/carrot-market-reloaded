import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(id: number) {
  //findUnique
  //update = db안의 record를 수정하고 나서 수정된 record를 반환해 줌
  //post가 불릴때마다 view를 올리고 싶기때문에 여기서는 update를 사용하면 db를 두번 부르지않아도됨
  //update method는 업데이트할 post를 찾지 못하면 에러를 발생시킴 => try catch 구문 사용 추천
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return post;
  } catch {
    return null;
  }
}

async function getIsLike(postId: number) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  return Boolean(like); // like가 있으면 (이미 like되어있다면 true / 아니면 false)
}

export default async function PostDetail({
  params,
}: {
  parmas: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getPost(id);
  if (!post) {
    return notFound();
  }
  //   console.log(post);

  const likePost = async () => {
    "use server";
    const session = await getSession();
    // user가 like를 두번 이상 하려면 에러가 남
    try {
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });
      revalidatePath(`/posts/${id}`);
    } catch (e) {}
  };

  const dislikePost = async () => {
    "use server";
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId: id,
          userId: session.id!,
        },
      },
    });
    revalidatePath(`/posts/${id}`);
  };

  const isLiked = await getIsLike(id);
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
          >
            <HandThumbUpIcon className="size-5" />
            <span>공감하기 ({post._count.likes})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
