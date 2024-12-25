import db from "@/lib/db";
import getSession from "@/lib/session";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    return user;
  }
  notFound(); //logged out user => profile page, no session.id => 404 not found
}

export default async function Profile() {
  console.log(cookies);
  const user = await getUser();
  const logOut = async() => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/")
  }

  console.log("profile user: ", user);
  return (
    <div>
      <h2>Welcome to profile, {user?.username}</h2>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
