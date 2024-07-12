import { Skeleton } from "../ui/skeleton";

function MainLoader() {
	return (
		<div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Skeleton className="h-[125px] w-full rounded-xl" />
			<Skeleton className="h-[125px] w-full rounded-xl" />
			<Skeleton className="h-[125px] w-full rounded-xl" />
		</div>
	);
}

export default MainLoader;
