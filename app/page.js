import Filter from "@/components/Filter";
import Hover from "@/components/Hover";
import Map from "@/components/Map";
import MapV2 from "@/components/MapV2";

export default function Home() {
	return (
		<main className="flex flex-col w-screen h-fit">
			{/* <Map /> */}
			<MapV2 />
			{/* <Hover /> */}
			{/* <Filter /> */}
		</main>
	);
}
