"use client";

import { useEffect, useState, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import mapJson from "./map.json";

const arrMarker = [
	[105.9151962942141, 20.920931262916405],
	[106.9151962942141, 21.920931262916405],
	[104.9151962942141, 19.920931262916405],
	[106.9151962942141, 20.920931262916405],
];

const apiKey = "c6a8fb5d25f0f32c87d1469f6847388c445850643364b94e";

export default function Map() {
	const mapRef = useRef();
	const [levelZoom, setLevelZoom] = useState(6);
	const [listMarker, setListMarker] = useState(null);
	const [value, setValue] = useState(null);
	const [data, setData] = useState(null);
	const debounceValue = useDebounce(value, 500);
	const searchRef = useRef();

	useEffect(() => {
		if (typeof window === "undefined" || !mapRef.current) return;
		loadMap();
		addMarker2();
		// addMarker3();
		addGeojsonLine();
	}, []);

	useEffect(() => {
		value !== null && callAPI();
	}, [debounceValue]);

	useEffect(() => {
		if (!listMarker && levelZoom > 7) {
			addMarker();
		}
		if (levelZoom < 7) {
			listMarker && listMarker.forEach((e) => e.remove());
			setTimeout(() => setListMarker(null), 500);
		}
	}, [levelZoom]);

	const loadMap = () => {
		mapRef.current = new vietmapgl.Map({
			container: "map",
			style: mapJson,
			// style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${apiKey}`,
			// style: `https://maps.vietmap.vn/mt/lm/style.json?apikey=${apiKey}`,
			// style: `https://maps.vietmap.vn/mt/dm/style.json?apikey=${apiKey}`,
			center: [105.78234226958115, 20.920931262916405],
			zoom: 6,
			pitch: 90, // starting zooms
		});
		mapRef.current.areTilesLoaded();

		mapRef.current.on("zoomend", function () {
			setLevelZoom(mapRef.current.getZoom());
		});
	};

	const callAPI = async () => {
		const res = await fetch(
			`https://maps.vietmap.vn/api/search?api-version=1.1&apikey=${apiKey}&text=${value}`
		);
		const { data } = await res.json();
		setData(data);
	};

	const addMarker = () => {
		//add marker to map
		const listMarkerNew = [];
		arrMarker.forEach((e) => {
			const markerNew = new vietmapgl.Marker({
				color: "red",
			})
				.setLngLat([e[0], e[1]])
				.setPopup(
					new vietmapgl.Popup().setHTML("<h1>Hello World!</h1>")
				)
				.addTo(mapRef.current);
			listMarkerNew.push(markerNew);
		});
		setListMarker(listMarkerNew);
	};

	// const addMarker3 = () => {
	// 	var el = document.createElement("div");

	// 	el.className = "marker-icon";

	// 	// el.style.backgroundImage = `url(assets/icon/marker-${item.name}.png)`;

	// 	el.style.width = "28px";

	// 	el.style.height = "40px";

	// 	el.style.marginTop = "-20px !important";

	// 	new vietmapgl.Marker(el, {})
	// 		.setLngLat([106.78234226958115, 20.920931262916405])
	// 		.addTo(mapRef.current);
	// };

	const addMarker2 = () => {
		const divElement = document.createElement("div");
		divElement.textContent = "4";
		divElement.setAttribute("data-marker", "4");
		// Set options
		new vietmapgl.Marker({
			// scale: [0.5], //size of marker
			element: divElement,
		})
			.setLngLat([105.78234226958115, 20.920931262916405])
			.setPopup(
				new vietmapgl.Popup().setHTML(`
				<div style="display:flex;gap:0 20px;">
					<img style="width:100px;height:100px;display:block" src="https://photo.rever.vn/v3/get/rvR1jXdw7H0hP421kBZHxZro33WX_3LZEyj3pgB0y3eVYSXsR5xV8shiKcRkasMNZU_1F3KsfBEMu185ODjL0WSg==/750x500/image.jpg" alt="">
					<div style="width:200px">
						<h2>Căn hộ 2pn 75m2 HQC Hóc Môn hướng Đông Nam, diện tích 75m²</h2>
						<p>Nguyễn Thị Sóc, Hóc Môn</p>
						<h6>1.3 ty</h6>
					</div>
				</div>
				`)
			)
			.addTo(mapRef.current);
	};

	const addGeojsonLine = () => {
		mapRef.current.on("load", function () {
			// mapRef.current.addSource("route", {
			// 	type: "geojson",
			// 	data: {
			// 		type: "Feature",
			// 		properties: {},
			// 		geometry: {
			// 			type: "LineString",
			// 			coordinates: [
			// 				[106.7061597962484, 10.770688562901288],
			// 				[106.69057544335796, 10.768747133937572],
			// 				[106.68189581514225, 10.764994908339784],
			// 				[106.67440708752872, 10.757690582434833],
			// 				[106.65985878585263, 10.7548236124389],
			// 			],
			// 		},
			// 	},
			// });
			// mapRef.current.addLayer({
			// 	id: "route",
			// 	type: "line",
			// 	source: "route",
			// 	layout: {
			// 		"line-join": "round",
			// 		"line-cap": "round",
			// 	},
			// 	paint: {
			// 		"line-color": "red",
			// 		"line-width": 8,
			// 	},
			// });
			mapRef.current.addSource("some id", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							properties: { name: "Null Island" },
							geometry: {
								type: "Point",
								coordinates: [
									105.78234226958115, 21.920931262916405,
								],
							},
						},
					],
				},
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
	const backDefault = () => {
		mapRef.current.flyTo({
			center: [105.78234226958115, 20.920931262916405],
			zoom: 9,
			speed: 0.2,
			curve: 1,
			easing(t) {
				return t;
			},
		});
	};

	const handleChangeSearch = (e) => {
		setValue(e.target.value);
	};

	return (
		<>
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
				<div
					id="back"
					style={{
						position: "absolute",
						top: 0,
						left: "50px",
						width: "50px",
						height: "50px",
						zIndex: 1000,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "black",
						color: "white",
					}}
					onClick={backDefault}
				>
					back
				</div>

				<input
					ref={searchRef}
					style={{
						display: "flex",
						position: "absolute",
						top: 0,
						left: "100px",
						background: "pink",
						width: "500px",
						height: "50px",
						zIndex: 1000,
						padding: "0 24px",
					}}
					type="text"
					placeholder="Search ..."
					onChange={handleChangeSearch}
				/>
				<ul
					id="list-address"
					style={{
						position: "absolute",
						top: "50px",
						left: "100px",
						background: "white",
						width: "500px",
						height: "auto",
						zIndex: 1000,
						listStyle: "none",
					}}
				>
					{data &&
						data?.features.map((e, index) => (
							<li
								onClick={() => {
									flyMap(
										e?.geometry?.coordinates[0],
										e?.geometry?.coordinates[1],
										18
									);
									searchRef.current.value =
										e?.properties?.name;
									setData(null);
								}}
								key={index}
							>
								{e?.properties?.name}
							</li>
						))}
					{!data && <li>Tim kiem gan day</li>}
				</ul>
			</div>
		</>
	);
}
