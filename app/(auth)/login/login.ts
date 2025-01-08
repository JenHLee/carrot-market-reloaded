import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function loginUser(user: {id: number}) {
    const session = await getSession();
    session.id = user.id;
    await session.save()
    return redirect("/profile")

}
