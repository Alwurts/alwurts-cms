export const dynamic = "force-dynamic";

import Link from "next/link";
import { buttonVariants } from "./components/ui/button";
import Image from "next/image";
import { HoverImage } from "./components/HoverImage";
import { TypewriterText } from "./components/TypewriterText";
import { getPublishedFeaturedPosts } from "@/server-actions/post";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedInIcon";

export default async function Home() {
	const featuredPosts = await getPublishedFeaturedPosts();
	return (
		<div className="max-w-6xl mx-auto text-xl">
			<section className="h-[calc(100vh-5rem)] pb-24 flex flex-col items-center justify-center w-full space-y-10 px-6">
				<div className="space-y-6 text-center">
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
			<section className="flex flex-col items-center w-full space-y-12 mb-36 px-6">
				<div className="space-y-6 text-center">
					<h2 className="text-6xl font-bold">Featured projects</h2>
					<p className="text-2xl">
						A collection of projects I&apos;m proud about.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-6 w-full mt-8 md:px-20 lg:px-44 xl:px-0">
					{featuredPosts.slice(0, 4).map((post) => (
						<Link
							href={`/projects/${post.url}`}
							key={post.postId}
							className="border-[3px] border-input-alwurts rounded-[40px] bg-background-alwurts text-card-foreground hover:bg-accent-alwurts transition-transform hover:scale-[97%]"
						>
							<div className="p-6">
								{post.imageLarge?.url && (
									<Image
										src={post.imageLarge.url}
										alt={post.title}
										width={250}
										height={250}
										className="object-contain h-[250px] w-auto mb-4 mx-auto"
									/>
								)}
								<h3 className="text-2xl font-bold">{post.title}</h3>
								<h4 className="text-lg text-primary-alwurts">
									{new Date(post.date).toLocaleDateString()}
								</h4>
								<p>
									{post.description.length > 100
										? `${post.description.substring(0, 100)}...`
										: post.description}
								</p>
							</div>
						</Link>
					))}
				</div>
				<div className="flex flex-col items-center justify-center space-y-7">
					<p className="text-2xl text-center">
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
			<section
				id="about"
				className="flex flex-col items-center w-full space-y-4 mb-12 md:mb-24 px-6"
			>
				<div className="space-y-14 text-center">
					<h2 className="text-6xl font-bold">Alejandro 101</h2>
					<div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12">
						<HoverImage
							defaultSrc="/alwurtstransparent.png"
							hoverSrc="/alwurtscolortransparent.png"
							alt="Alejandro 101"
							width={500}
							height={500}
							className="h-72 w-72 rounded-full border-[4px] border-input-alwurts hover:bg-accent-alwurts mx-auto"
						/>
						<div>
							<p className="text-start text-xl mt-4">
								Full Stack Developer with experience in crafting efficient and
								scalable web applications. My expertise encompasses frontend
								frameworks and backend architectures, obtained through roles at
								Oracle and other tech ventures. Proficient in TypeScript,
								JavaScript, React, Next JS and Python, I prioritize clean code,
								optimized performance, and user-centric design.
							</p>
							<p className="text-start text-xl mt-4">
								Checkout my LinkedIn for more information about my professional
								experience and my Github for some of my personal projects.
							</p>
							<div className="flex space-x-4 mt-4">
								<Link
									className="hover:opacity-90 hover:scale-105 transition-all"
									href="https://www.linkedin.com/in/alejandrowurts/"
								>
									<LinkedinIcon className="w-14 h-14" />
								</Link>
								<Link
									className="hover:opacity-90 hover:scale-105 transition-all"
									href="https://github.com/alwurts"
								>
									<GithubIcon className="w-14 h-14" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
