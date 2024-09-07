import { getPublishedBlogs } from "@/server-actions/post";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function BlogPosts() {
  const posts = await getPublishedBlogs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {posts.map((post) => (
        <Link
          key={post.postId}
          href={`/blog/${post.url}`}
          className="group flex flex-col space-y-2 hover:opacity-80 transition-opacity"
        >
          {post.imageSmall && (
            <div className="relative w-full aspect-video">
              <Image
                src={post.imageSmall.url}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <h3 className="text-2xl font-semibold group-hover:underline">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground-alwurts">
            {new Date(post.date).toLocaleDateString()}
          </p>
          <p className="text-base">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.tagName} variant="secondary">
                {tag.tagName}
              </Badge>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}