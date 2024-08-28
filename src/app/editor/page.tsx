import { getPosts } from "@/server-actions/post";
import CreateButton from "./components/CreateButton";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PostCard = dynamic(() => import("./components/PostCard"), {
	loading: () => <Skeleton className="w-full h-[300px]" />,
	ssr: false,
});

const PostTableRow = dynamic(() => import("./components/PostTable"), {
	loading: () => <Skeleton className="w-full h-[50px]" />,
	ssr: false,
});

export default async function CMSPostsPage() {
	const posts = await getPosts();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
			<div className="mb-6">
				<CreateButton />
			</div>
			<Tabs defaultValue="cards" className="w-full">
				<TabsList>
					<TabsTrigger value="cards">Cards</TabsTrigger>
					<TabsTrigger value="table">Table</TabsTrigger>
				</TabsList>
				<TabsContent value="cards">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
						{posts?.map((post) => (
							<div key={post.id} className="grid">
								<PostCard post={post} />
							</div>
						))}
					</div>
				</TabsContent>
				<TabsContent value="table">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>URL</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Version</TableHead>
								<TableHead>Author</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts?.map((post) => (
								<PostTableRow key={post.id} post={post} />
							))}
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</div>
	);
}
