import dynamic from "next/dynamic";

const MDXEditor = dynamic(() => import("@/components/MDXEditor"), {
	ssr: false,
});

export default function Editor() {
	return (
		<div className="p-4">
			<MDXEditor markdown="# Hello world" />
		</div>
	);
}
