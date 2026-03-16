import { createPostAction } from "@/app/admin/posts/actions";

export default async function AdminNewPostPage() {
  await createPostAction();
}
