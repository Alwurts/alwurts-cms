import { getPosts } from "@/server-actions/post";
import CreateButton from "./components/CreateButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortSelect } from "./components/SortSelect";
import type { SortOption, SortDirection } from "@/proxies/posts";
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { TPost } from "@/types/database/post";

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

  const projectPosts = posts.filter(post => post.type === 'project');
  const blogPosts = posts.filter(post => post.type === 'blog');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
      <div className="mb-6 flex justify-between items-center">
        <CreateButton />
        <SortSelect currentSort={sort} currentDirection={direction} />
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PostsView posts={posts} />
        </TabsContent>
        <TabsContent value="projects">
          <PostsView posts={projectPosts} />
        </TabsContent>
        <TabsContent value="blogs">
          <PostsView posts={blogPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostsView({ posts }: { posts: TPost[] }) {
  return (
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
  );
}
