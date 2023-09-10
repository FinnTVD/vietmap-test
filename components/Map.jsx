"use client";

import { useEffect, useState, useRef } from "react";

const apiKey = "c6a8fb5d25f0f32c87d1469f6847388c445850643364b94e";

export default function Map() {
	const mapRef = useRef();
	const [levelZoom, setLevelZoom] = useState(6);

	useEffect(() => {
		if (typeof window === "undefined" || !mapRef.current) return;
		loadMap();
		addGeojsonLine();
	}, []);

	useEffect(() => {}, [levelZoom]);

	const loadMap = () => {
		mapRef.current = new vietmapgl.Map({
			container: "map",
			style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${apiKey}`,
			center: [105.85379875200005, 21.028354507000074], //ha noi center
			zoom: 9,
			pitch: 0, // góc nhìn từ trên cao nhìn xuống
		});
		mapRef.current.areTilesLoaded();

		mapRef.current.on("zoomend", function () {
			setLevelZoom(mapRef.current.getZoom());
		});
	};

	const addGeojsonLine = () => {
		mapRef.current.on("load", function () {
			mapRef.current.addSource("traffic-tiles", {
				type: "raster",
				tiles: [
					`https://maps.vietmap.vn/api/tf/{z}/{x}/{y}.png?apikey=${apiKey}`,
				],
				tileSize: 256,
			});
			mapRef.current.addLayer({
				id: "traffic-tiles",
				type: "raster",
				source: "traffic-tiles",
				minZoom: 8,
				maxZoom: 20,
			});
		});
	};

	const flyMap = (
		lat = 104.78234226958115,
		lon = 22.920931262916405,
		zoom = 9
	) => {
		mapRef.current.flyTo({
			center: [lat, lon],
			zoom: zoom,
			// speed: 0.2,
			curve: 1,
			// easing(t) {
			// 	return t;
			// },
		});
		setLevelZoom(zoom);
	};

	return (
		<>
			<head>
				<script src="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js"></script>
				<link
					href="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css"
					rel="stylesheet"
				/>
			</head>
			<div
				ref={mapRef}
				style={{
					position: "relative",
				}}
				id="map"
			>
				<div
					id="fly"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "50px",
						height: "50px",
						zIndex: 1000,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "blue",
						color: "white",
					}}
					onClick={() => flyMap()}
				>
					fly
				</div>
			</div>
		</>
	);
}
