import { Skeleton } from "../ui/skeleton";

function FormLoader() {
	return (
		<div className="p-1 flex flex-col space-y-3">
			<Skeleton className="h-[75px] w-full rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-9/12" />
				<Skeleton className="h-4 w-5/12" />
				<Skeleton className="h-4 w-7/12" />
			</div>
		</div>
	);
}

export default FormLoader;
