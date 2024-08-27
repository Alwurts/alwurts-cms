export const dynamic = "force-dynamic";

import MainLoader from "@/components/skeleton/MainLoader";
import { Suspense } from "react";
import Posts from "../components/PostLIst";

export default function Projects() {
	return (
		<div className="max-w-5xl mx-auto text-xl">
			<section className="flex flex-col items-center w-full space-y-12 mt-10 px-6">
				<div className="space-y-6 text-center">
					<h2 className="text-6xl font-bold">Projects</h2>
				</div>
				<Suspense fallback={<MainLoader />}>
					<Posts />
				</Suspense>
			</section>
		</div>
	);
}
