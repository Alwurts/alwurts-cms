import { getPosts } from "@/server-actions/post";
import CreateButton from "./components/CreateButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortSelect } from "./components/SortSelect";
import type { SortOption, SortDirection } from "@/proxies/posts";
import dynamic from 'next/dynamic';

const PostCards = dynamic(() => import('./components/PostCard'), { ssr: false });
const PostTable = dynamic(() => import('./components/PostTable'), { ssr: false });

export default async function CMSPostsPage({
  searchParams,
}: {
  searchParams: { sort?: SortOption; direction?: SortDirection };
}) {
  const sort = (searchParams.sort as SortOption) || "url";
  const direction = (searchParams.direction as SortDirection) || "asc";
  const posts = await getPosts(sort, direction);

  if (!posts || posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
      <div className="mb-6 flex justify-between items-center">
        <CreateButton />
        <SortSelect currentSort={sort} currentDirection={direction} />
      </div>
      <Tabs defaultValue="cards" className="w-full">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="cards">
          <PostCards posts={posts} />
        </TabsContent>
        <TabsContent value="table">
          <PostTable posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
