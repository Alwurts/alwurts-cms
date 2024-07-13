import Link from "next/link";
import { Badge } from "./components/ui/badge";
import { Button, buttonVariants } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Image from "next/image";
import { HoverImage } from "./components/HoverImage";
import { TypewriterText } from "./components/TypewriterText";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";

const featuredPosts = [
	{
		id: "1",
		title: "Post 1",
		author: "Alejandro Wurts",
		publishedAt: "2021-01-01",
		content: "This is the content of the post",
	},
	{
		id: "2",
		title: "Post 2",
		author: "Alejandro Wurts",
		publishedAt: "2021-01-01",
		content: "This is the content of the post",
	},
	{
		id: "3",
		title: "Post 3",
		author: "Alejandro Wurts",
		publishedAt: "2021-01-01",
		content: "This is the content of the post",
	},
	{
		id: "4",
		title: "Post 4",
		author: "Alejandro Wurts",
		publishedAt: "2021-01-01",
		content: "This is the content of the post",
	},
];

export default function Home() {
	return (
		<div className="max-w-5xl mx-auto text-xl">
			<section className="h-[calc(100vh-5rem)] pb-24 flex flex-col items-center justify-center w-full space-y-10">
				<div className="space-y-6">
					<h1 className="text-7xl font-bold text-accent-alwurts">
						Alejandro Wurts
					</h1>
					<h2 className="text-6xl text-center font-medium text-primary-alwurts">
						<TypewriterText
							options={[
								"Software Developer",
								"Indie Hacker",
								"Full Stack Engineer",
								"Problem Solver",
							]}
						/>
					</h2>
				</div>
				<Link
					href="/contact"
					className={buttonVariants({
						size: "xl",
						variant: "outline",
					})}
				>
					About me
				</Link>
			</section>
			<section className="flex flex-col items-center w-full space-y-12 mb-36">
				<div className="space-y-6 text-center">
					<h2 className="text-6xl font-bold">Featured projects</h2>
					<p className="text-2xl">
						A collection of projects I&apos;m proud about.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full mt-8">
					{featuredPosts.map((post) => (
						<Link
							href={`/posts/${post.id}`}
							key={post.id}
							className="border-[3px] border-input-alwurts rounded-[40px] bg-background-alwurts text-card-foreground hover:bg-accent-alwurts transition-transform hover:scale-[97%]"
						>
							<CardHeader className="pb-3">
								<CardTitle>{post.title}</CardTitle>
								<CardDescription className="text-lg text-primary-alwurts">
									{new Date(post.publishedAt).toLocaleDateString()}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{post.content.substring(0, 100)}...</p>
							</CardContent>
						</Link>
					))}
				</div>
				<div className="flex flex-col items-center justify-center space-y-7">
					<p className="text-2xl">
						To see some of my other projects, click below
					</p>
					<Link
						href="/projects"
						className={buttonVariants({ variant: "outline", size: "xl" })}
					>
						Projects
					</Link>
				</div>
			</section>
			<section className="flex flex-col items-center w-full space-y-4 mb-24">
				<div className="space-y-14 text-center">
					<h2 className="text-6xl font-bold">Alejandro 101</h2>
					<div className="flex justify-center space-x-12">
						<HoverImage
							defaultSrc="/alwurtstransparent.png"
							hoverSrc="/alwurtscolortransparent.png"
							alt="Alejandro 101"
							width={500}
							height={500}
							className="h-72 w-72 rounded-full border-[4px] border-input-alwurts hover:bg-accent-alwurts"
						/>
						<p className="text-start text-xl mt-4">
							Software developer with a passion for web development, capable of
							making scalable dynamic web applications. Most recently, I&apos;ve
							been developing full stack web apps using tools like Next JS and
							Express while learning how to scale them for different workloads.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
