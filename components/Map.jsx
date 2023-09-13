"use client";

// const addGeojsonLine = () => {
// 	mapRef.current.on("load", function () {
// 		mapRef.current.addSource("traffic-tiles", {
// 			type: "raster",
// 			tiles: [
// 				`https://maps.vietmap.vn/api/tf/{z}/{x}/{y}.png?apikey=${apiKey}`,
// 			],
// 			tileSize: 256,
// 		});
// 		mapRef.current.addLayer({
// 			id: "traffic-tiles",
// 			type: "raster",
// 			source: "traffic-tiles",
// 			minZoom: 8,
// 			maxZoom: 20,
// 		});
// 	});
// };

import { useEffect, useState, useRef } from "react";
import useSWR, { mutate } from "swr";

const apiKey = "c6a8fb5d25f0f32c87d1469f6847388c445850643364b94e";

const handlePopup = (itemProject) => {
	if (!itemProject) return;
	return `<div
                            key=${itemProject?.id}
                            class="flex gap-x-[0.88vw]"
                        >
                            <img
                                class="w-[5.4375vw] h-[4.75vw] block object-cover"
                                src=${
									itemProject?.firstImage
										? itemProject?.firstImage
										: "/images/itemproject.jpg"
								}
                                alt=${itemProject?.translation?.name}
                            />
                            <div class="w-[12.0625vw]">
                                <h2 class='line-clamp-1'>${
									itemProject?.translation?.name ?? ""
								}</h2>
                                <div
                                            title=${
												itemProject?.address?.display
											}
                                            class='flex items-center'
                                        >
                                            <span class='ml-[0.5vw] mr-[0.25vw] text-black title14-700-150 whitespace-nowrap'>
                                                Địa chỉ:
                                            </span>
                                            <span class='capitalize text-black title14-400-150 line-clamp-1'>
                                                ${
													itemProject?.address?.name +
													", " +
													itemProject?.address?.ward +
													", " +
													itemProject?.address
														?.district
												}
                                            </span>
                                        </div>
                                        <div class='flex items-center my-[0.5vw]'>
                                            <span class='ml-[0.5vw] mr-[0.25vw] text-black title14-700-150'>
                                                Diện tích:
                                            </span>
                                            <span class=' text-black title14-400-150'>
                                                ${
													itemProject?.translation
														?.size + " m²"
												}
                                            </span>
                                        </div>
                                        <div class='flex items-center'>
                                            
                                            <span class='ml-[0.5vw] mr-[0.25vw] text-black title14-700-150'>
                                                Mức giá:
                                            </span>
                                            <span class='capitalize text-black title14-400-150'>
                                                ${
													itemProject?.translation
														?.priceDisplay
												}
                                            </span>
                                        </div>
                            </div>
                        </div>`;
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Map() {
	const mapRef = useRef(); //get map
	const [isFly, setIsFly] = useState(false);
	const [levelZoom, setLevelZoom] = useState(9); //default level zoom
	console.log("🚀 ~ file: Map.jsx:32 ~ Map ~ levelZoom:", levelZoom);
	const [cityId, setCityId] = useState(11); // default city id = 11 (Ha Noi)
	const [districtId, setDistrictId] = useState(null);
	console.log("🚀 ~ file: Map.jsx:35 ~ Map ~ districtId:", districtId);
	const [wardId, setWardId] = useState(null);
	console.log("🚀 ~ file: Map.jsx:37 ~ Map ~ wardId:", wardId);
	const [listMarkerDistrict, setListMarkerDistrict] = useState(null); // save list marker
	const [isCheck, setIsCheck] = useState(false); //check delete marker only one
	const [isCheck1, setIsCheck1] = useState(false); //check delete marker only one
	const [isDrag, setIsDrag] = useState(false);

	const {
		data: dataMap,
		error: errorMap,
		isLoading: isLoadingMap,
	} = useSWR(
		`${
			process.env.NEXT_PUBLIC_API
		}/property/property-by-address?cityId=${cityId}${
			districtId ? "&districtId=" + districtId : ""
		}${wardId ? "&wardId=" + wardId : ""}`, // get data marker to render
		fetcher
	);
	console.log("🚀 ~ file: Map.jsx:43 ~ Map ~ dataMap:", dataMap);

	const {
		data: dataItemMap,
		error: errorItemMap,
		isLoading: isLoadingItemMap,
	} = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property?cityId=${cityId}${
			districtId ? "&districtId=" + districtId : ""
		}${wardId ? "&wardId=" + wardId : ""}`, // get count
		fetcher
	);
	console.log("🚀 ~ file: Map.jsx:58 ~ Map ~ dataItemMap:", dataItemMap);

	const {
		data: dataProvinces,
		error: errorProvinces,
		isLoading: isLoadingProvinces,
	} = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property/property-by-address`, // get list data project in province
		fetcher
	);

	const {
		data: dataDistrict,
		error: errorDistrict,
		isLoading: isLoadingDistrict,
	} = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property/property-by-address?cityId=${cityId}`, // get list data project in province
		fetcher
	);

	const {
		data: dataWard,
		error: errorWard,
		isLoading: isLoadingWard,
	} = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property/property-by-address?cityId=${cityId}&districtId=${districtId}`, // get list data project in province
		fetcher
	);
	console.log("🚀 ~ file: Map.jsx:90 ~ Map ~ dataWard:", dataWard);

	useEffect(() => {
		if (typeof window === "undefined" || !mapRef.current) return;
		loadMap(); //add map
	}, []);

	useEffect(() => {
		dataMap && dataItemMap && addMarkerItem(dataMap);
		// if data then render marker
	}, [dataMap, dataItemMap]);

	useEffect(() => {
		getLocationCurrent();
		if (levelZoom >= 13.5) {
			if (!isCheck1) {
				listMarkerDistrict?.ward?.forEach((e) => e.remove());
				setTimeout(
					() =>
						setListMarkerDistrict((prev) => ({
							...prev,
							ward: null,
						})),
					10
				);
				setIsCheck1(true);
			}
			getLocationCurrent();
			return;
		}
		if (levelZoom >= 11.5 && levelZoom < 13.5) {
			if (wardId && isCheck1) {
				listMarkerDistrict?.detail?.forEach((e) => e.remove());
				setIsCheck1(false);
				setWardId(null);
			}
			if (!isCheck) {
				listMarkerDistrict?.district?.forEach((e) => e.remove());
				setTimeout(
					() =>
						setListMarkerDistrict((prev) => ({
							...prev,
							district: null,
						})),
					10
				);
				setIsCheck(true);
			}
			getLocationCurrent();
			return;
		}
		if (districtId && levelZoom < 11.5) {
			if (isCheck) {
				listMarkerDistrict?.ward?.forEach((e) => e.remove());
				setTimeout(
					() =>
						setListMarkerDistrict((prev) => ({
							...prev,
							ward: null,
						})),
					10
				);
				setIsCheck(false);
			}
			setDistrictId(null);
		}
	}, [levelZoom, isDrag]);

	const loadMap = () => {
		mapRef.current = new vietmapgl.Map({
			container: "map",
			style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${apiKey}`,
			center: [105.85379875200005, 21.028354507000074], //ha noi center
			zoom: 9,
			pitch: 0, // góc nhìn từ trên cao nhìn xuống
		});

		mapRef?.current?.on("zoomstart", function () {
			setLevelZoom(mapRef?.current?.getZoom());
		});
		mapRef?.current?.on("dragstart", () => {
			setIsDrag((prev) => !prev);
		});
	};

	const getLocationCurrent = async () => {
		try {
			console.log(
				"🚀 ~ file: Map.jsx:205 ~ getLocationCurrent ~ dataMap:",
				dataMap
			);
			const ct = await mapRef?.current?.getCenter();
			const res = await fetch(
				`https://maps.vietmap.vn/api/reverse/v3?apikey=${apiKey}&lng=${ct?.lng}&lat=${ct?.lat}`
			);
			// get data follow center viewport
			const data = await res.json();

			const one = dataMap?.find(
				(e) => Number(e?.district_id) === data[0]?.boundaries[1]?.id // boundaries[1]<=> district
			);

			if (Number(one?.count) <= 1) return;
			if (levelZoom >= 11.5) {
				setDistrictId(data[0]?.boundaries[1]?.id);
				if (data[0]?.boundaries[1]?.id !== districtId) {
					listMarkerDistrict?.ward?.forEach((e) => e.remove());
				}
			}
			if (levelZoom >= 13.5) {
				setWardId(data[0]?.boundaries[0]?.id); // boundaries[1]<=> ward
				if (data[0]?.boundaries[0]?.id !== wardId) {
					listMarkerDistrict?.detail?.forEach((e) => e.remove());
				}
			}
		} catch (error) {
			throw new Error();
		}
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
		getLocationCurrent();
		setLevelZoom(zoom);
	};

	const addMarkerItem = (listMarker) => {
		if (levelZoom >= 13.5) {
			const listMarkerDistrictNew = [];
			listMarker?.forEach((e) => {
				const listProjectIn = dataItemMap?.data?.filter(
					(i) => i?.address?.id === e?.id
				);
				let childNode = "";
				if (listProjectIn) {
					childNode = listProjectIn?.reduce(
						(acc, itemProject) => acc + handlePopup(itemProject),
						""
					);
				}
				const divElement = document.createElement("div");
				divElement.textContent = e?.count;
				divElement.setAttribute("data-marker", `${e?.id}`);
				// Set options
				const marker = new vietmapgl.Marker({
					// scale: [0.5], //size of marker
					element: divElement,
				})
					.setLngLat([e?.lng, e?.lat])
					.setPopup(
						new vietmapgl.Popup().setHTML(`
                        <div style="width:fit-content;${
							listProjectIn?.length > 3
								? "height:20.625vw;overflow-x:hidden;overflow-y:scroll"
								: "height:fit-content;"
						}">
                            ${childNode}
                        </div>
                `)
					)
					.addTo(mapRef.current);
				listMarkerDistrictNew.push(marker);
			});
			setListMarkerDistrict((prev) => ({
				...prev,
				detail: [...listMarkerDistrictNew],
			}));
			return;
		} else if (levelZoom >= 11.5) {
			const listMarkerDistrictNew = [];
			listMarker?.forEach((e) => {
				const listProjectIn = dataItemMap?.data?.filter(
					(i) => i?.address?.wardId === e?.ward_id
				);
				let childNode = "";
				if (listProjectIn) {
					childNode = listProjectIn?.reduce(
						(acc, itemProject) => acc + handlePopup(itemProject),
						""
					);
				}
				const divElement = document.createElement("div");
				divElement.textContent = e?.count;
				divElement.setAttribute("data-marker", `${e?.ward_id}`);
				// Set options
				const marker = new vietmapgl.Marker({
					// scale: [0.5], //size of marker
					element: divElement,
				})
					.setLngLat([e?.ward_lng, e?.ward_lat])
					.setPopup(
						new vietmapgl.Popup().setHTML(`
                        <div style="width:fit-content;${
							listProjectIn?.length > 3
								? "height:20.625vw;overflow-x:hidden;overflow-y:scroll"
								: "height:fit-content;"
						}">
                            ${childNode}
                        </div>
                `)
					)
					.addTo(mapRef.current);
				listMarkerDistrictNew.push(marker);
			});
			setListMarkerDistrict((prev) => ({
				...prev,
				ward: [...listMarkerDistrictNew],
			}));
			return;
		} else {
			const listMarkerDistrictNew = [];
			listMarker?.forEach((e) => {
				const listProjectIn = dataItemMap?.data?.filter(
					(i) => i?.address?.districtId === e?.district_id
				);
				let childNode = "";
				if (listProjectIn) {
					childNode = listProjectIn?.reduce(
						(acc, itemProject) => acc + handlePopup(itemProject),
						""
					);
				}
				const divElement = document.createElement("div");
				divElement.textContent = e?.count;
				divElement.setAttribute("data-marker", `${e?.district_id}`);
				// Set options
				const marker = new vietmapgl.Marker({
					// scale: [0.5], //size of marker
					element: divElement,
				})
					.setLngLat([e?.district_lng, e?.district_lat])
					.setPopup(
						new vietmapgl.Popup().setHTML(`
                <div style="width:fit-content;${
					listProjectIn?.length > 3
						? "height:20.625vw;overflow-x:hidden;overflow-y:scroll"
						: "height:fit-content;"
				}">
                    ${childNode}
                </div>
                `)
					)
					.addTo(mapRef.current);
				listMarkerDistrictNew.push(marker);
			});
			setListMarkerDistrict((prev) => ({
				...prev,
				district: [...listMarkerDistrictNew],
			}));
			return;
		}
	};

	const handleChangeCity = (e) => {
		const itemCity = dataProvinces?.find(
			(i) => i?.city_id == e?.target?.value
		);
		listMarkerDistrict?.district?.forEach((e) => e.remove());
		listMarkerDistrict?.ward?.forEach((e) => e.remove());
		listMarkerDistrict?.detail?.forEach((e) => e.remove());
		//delete marker before fly to city other
		setCityId(Number(e?.target?.value));
		setDistrictId(null);
		setWardId(null);
		flyMap(itemCity?.city_lng, itemCity?.city_lat);
		// fly zoom to city
	};

	const handleChangeDistrict = (e) => {
		if (e?.target?.value === "default") return;
		const itemCity = dataDistrict?.find(
			(i) => i?.district_id == e?.target?.value
		);
		listMarkerDistrict?.district?.forEach((e) => e.remove());
		listMarkerDistrict?.detail?.forEach((e) => e.remove());
		//delete marker before fly to city other
		setDistrictId(Number(e?.target?.value));
		setWardId(null);
		flyMap(itemCity?.district_lng, itemCity?.district_lat, 11.5);
		// fly zoom to district
	};

	const handleChangeWard = (e) => {
		if (e?.target?.value === "default") return;
		const itemCity = dataWard?.find((i) => i?.ward_id == e?.target?.value);
		listMarkerDistrict?.detail?.forEach((e) => e.remove());
		//delete marker before fly to city other
		setWardId(Number(e?.target?.value));
		flyMap(itemCity?.ward_lng, itemCity?.ward_lat, 13.5);
		// fly zoom to ward
	};

	return (
		<>
			<head>
				<link
					href="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css"
					rel="stylesheet"
				/>
				<script src="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js"></script>
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
				<div className="absolute top-0 left-[50px] flex w-fit h-fit z-[1000] bg-white">
					<select
						onChange={handleChangeCity}
						className="text-black"
						name=""
						id=""
					>
						{dataProvinces?.map((e, index) => (
							<option
								selected={e?.city_id == cityId}
								defaultCheck={e?.city_id == cityId}
								key={index}
								value={e?.city_id}
							>
								{e?.city}
							</option>
						))}
					</select>
					<select
						onChange={handleChangeDistrict}
						className="text-black"
						name=""
						id=""
					>
						<option
							disabled
							selected
							defaultChecked
							value="default"
						>
							Quận/huyện
						</option>
						{dataDistrict
							?.filter((e) => e?.district_id != 0)
							?.map((e, index) => (
								<option key={index} value={e?.district_id}>
									{e?.district}
								</option>
							))}
					</select>
					{districtId && dataWard && (
						<select
							onChange={handleChangeWard}
							className="text-black"
							name=""
							id=""
						>
							<option
								disabled
								selected
								defaultChecked
								value="default"
							>
								Phường/xã
							</option>
							{dataWard?.map((e, index) => (
								<option key={index} value={e?.ward_id}>
									{e?.ward}
								</option>
							))}
						</select>
					)}
				</div>
			</div>
		</>
	);
}
