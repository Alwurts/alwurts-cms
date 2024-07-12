
import { CardLayout } from "@/components/layout/CardLayout";

export default async function AppHome() {
	return <MainSocialAccount />;
}

async function MainSocialAccount() {
	return (
		<CardLayout
			cardHeaderContent={{
				title: "Main Social Account",
				description: "Manage your main social account",
			}}
		>
			<div className="flex flex-col bg-gray-100 rounded-md">
				<div className="p-4 font-bold bg-gray-200 rounded-t-md">
					Current Session
				</div>
			</div>
		</CardLayout>
	);
} 
