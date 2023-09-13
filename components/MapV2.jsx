"use client";
import { useEffect, useState, useRef } from "react";
import SelectComponent from "./SelectComponent";
import useDebounce from "./useDebounce";
import useSWR from "swr";
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
const initial = {
	district: null,
	ward: null,
	detail: null,
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function MapV2() {
	const mapRef = useRef(); //lưu lại dom map
	const [value, setValue] = useState("");
	const debounceValue = useDebounce(value, 500);
	const [isFly, setIsFly] = useState(false); // trigger sự kiện fly to
	const [levelZoom, setLevelZoom] = useState(9); //lưu level zoom
	const [cityId, setCityId] = useState(11); // default city id = 11 (Ha Noi)
	const [districtId, setDistrictId] = useState(null); // lưu id district
	const [wardId, setWardId] = useState(null); //  lưu id ward
	const [listMarkerDistrict, setListMarkerDistrict] = useState(initial); // lưu các marker lại đê xoá
	const [isDeleteDistrict, setIsDeleteDistrict] = useState(false); //nếu district id thay đổi thì biến thay đổi theo
	const [isDrag, setIsDrag] = useState(false); // trigger sự kiện drag
	const [dataItemMap, setDataItemMap] = useState(null);
	const [dataDistrict, setDataDistrict] = useState(null);
	const [dataMap, setDataMap] = useState(null);
	const [dataProvinces, setDataProvinces] = useState(null); // trả về danh sách các tỉnh có dự án
	const [dataWard, setDataWard] = useState(null);
	const [isClose, setIsClose] = useState(false);

	const {
		data: dataSearch,
		isLoading: isLoadingSearch,
		error: errorSearch,
	} = useSWR(
		`https://maps.vietmap.vn/api/search/v3?apikey=${apiKey}&text=${debounceValue}`,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);
	console.log("🚀 ~ file: MapV2.jsx:98 ~ MapV2 ~ dataSearch:", dataSearch);

	const {
		data: dataProject,
		isLoading: isLoadingProject,
		error: errorProject,
	} = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property?page=1&take=10${
			cityId ? "&cityId=" + cityId : ""
		}${districtId ? "&districtId=" + districtId : ""}${
			wardId ? "&wardId=" + wardId : ""
		}`,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	//get danh sách các tỉnh có dự án
	useEffect(() => {
		if (typeof window === "undefined" || !mapRef.current) return;
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API}/property/property-by-address`
				);
				const data = await res.json();
				setDataProvinces(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
		loadMap(); //add map
	}, []);

	//get count và dự án chi tiết theo cityId, districtId và wardId
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API}/property?cityId=${cityId}${
						districtId ? "&districtId=" + districtId : ""
					}${wardId ? "&wardId=" + wardId : ""}`
				);
				const data = await res.json();
				setDataItemMap(data);
			} catch (error) {
				console.log(error);
			}
		};
		const fetchData1 = async () => {
			try {
				const res = await fetch(
					`${
						process.env.NEXT_PUBLIC_API
					}/property/property-by-address?cityId=${cityId}${
						districtId ? "&districtId=" + districtId : ""
					}${wardId ? "&wardId=" + wardId : ""}`
				);
				const data = await res.json();
				setDataMap(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
		fetchData1();
	}, [districtId, wardId, cityId]);

	//get count các quận/huyện
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API}/property/property-by-address?cityId=${cityId}`
				);
				const data = await res.json();
				setDataDistrict(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [cityId]);

	//get count các phường/xã
	useEffect(() => {
		const fetchDataWard = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API}/property/property-by-address?cityId=${cityId}&districtId=${districtId}`
				);
				const data = await res.json();
				setDataWard(data);
			} catch (error) {
				console.log(error);
			}
		};
		districtId && fetchDataWard();
	}, [cityId, districtId]);

	// nếu có data chi tiết của dự án theo cityId, districtId và wardId thì add marker tương ứng
	useEffect(() => {
		dataItemMap && addMarkerItem(dataMap);
		// if data then render marker
	}, [dataItemMap]);

	// di chuyển qua các qh thì sẽ xoá các qh khác
	useEffect(() => {
		listMarkerDistrict?.district?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		listMarkerDistrict?.ward?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		return setListMarkerDistrict((prev) => ({
			...prev,
			district: null,
			ward: null,
		}));
	}, [isDeleteDistrict]);

	// xử lý các marker theo sự kiên zoom và drag
	useEffect(() => {
		if (isFly) return;
		getLocationCurrent();
		if (levelZoom >= 13.5) {
			listMarkerDistrict?.ward?.forEach((e) => {
				if (typeof e === "object") {
					e?.remove();
				}
			});
		}
		if (levelZoom >= 11.5 && levelZoom < 13.5) {
			listMarkerDistrict?.district?.forEach((e) => {
				if (typeof e === "object") {
					e?.remove();
				}
			});
			listMarkerDistrict?.detail?.forEach((e) => {
				if (typeof e === "object") {
					e?.remove();
				}
			});
			setWardId(null);
		}
		if (districtId && levelZoom < 11.5) {
			listMarkerDistrict?.ward?.forEach((e) => {
				if (typeof e === "object") {
					e?.remove();
				}
			});
			setDistrictId(null);
		}
	}, [levelZoom, isDrag]);

	//add map vào DOM, add sự kiện zoom + drag
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

	// kiểm tra xem điểm giữa của khung hình đang là quân/huyện nào hay là phường/xã nào
	const getLocationCurrent = async () => {
		try {
			const ct = await mapRef?.current?.getCenter();
			// call api theo tạo độ center của view map
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
					listMarkerDistrict?.ward?.forEach((e) => {
						if (typeof e === "object") {
							e?.remove();
						}
					});
				}
			}
			if (levelZoom >= 13.5) {
				setWardId(data[0]?.boundaries[0]?.id); // boundaries[1]<=> ward
				if (data[0]?.boundaries[0]?.id !== wardId) {
					listMarkerDistrict?.detail?.forEach((e) => {
						if (typeof e === "object") {
							e?.remove();
						}
					});
				}
			}
		} catch (error) {
			throw new Error();
		}
	};

	// fly đến tỉnh/quận/phươ
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
		setTimeout(() => {
			setIsFly(false);
		}, 1000);
	};

	const addMarkerItem = (listMarker) => {
		if (!dataItemMap || !listMarker) return;
		if (levelZoom >= 13.5) {
			if (
				listMarkerDistrict?.detail?.length &&
				listMarkerDistrict?.detail[
					listMarkerDistrict?.detail?.length - 1
				] == wardId
			)
				return;
			const listMarkerDistrictNew = [];
			listMarker?.forEach((e) => {
				const listProjectIn = dataItemMap?.data?.filter(
					(i) => i?.address?.id === e?.id
				);
				let childNode = null;
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
					.setLngLat([e?.lng || 0, e?.lat || 0])
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
				detail: [...listMarkerDistrictNew, wardId],
			}));
			setIsDeleteDistrict(!isDeleteDistrict);
			return;
		} else if (levelZoom >= 11.5) {
			if (
				listMarkerDistrict?.ward?.length &&
				listMarkerDistrict?.ward[
					listMarkerDistrict?.ward?.length - 1
				] == districtId
			)
				return;
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
					.setLngLat([e?.ward_lng || 0, e?.ward_lat || 0])
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
				ward: [...listMarkerDistrictNew, districtId],
			}));
			return;
		} else {
			if (
				listMarkerDistrict?.district?.length &&
				listMarkerDistrict?.district[
					listMarkerDistrict?.district?.length - 1
				] == cityId
			)
				return;
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
					.setLngLat([e?.district_lng || 0, e?.district_lat || 0])
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
				district: [...listMarkerDistrictNew, cityId],
			}));
			return;
		}
	};

	// handle change city
	const handleChangeCity = (id) => {
		const itemCity = dataProvinces?.find((i) => i?.city_id == id);
		//set lại cityid
		setCityId(Number(id));
		// khi chuyển city thì setDistrictId và setWardId về null
		setDistrictId(null);
		setWardId(null);

		// fly zoom to city
		flyMap(itemCity?.city_lng, itemCity?.city_lat);
		// khi đổi tỉnh thì xoá tất cả các marker đi
		listMarkerDistrict?.district?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		listMarkerDistrict?.ward?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		listMarkerDistrict?.detail?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		setListMarkerDistrict(initial);
	};

	//handle change district
	const handleChangeDistrict = (id) => {
		const itemCity = dataDistrict?.find((i) => i?.district_id == id);
		setIsDeleteDistrict(!isDeleteDistrict);
		setWardId(null);
		setIsFly(true);
		flyMap(itemCity?.district_lng, itemCity?.district_lat, 11.5);
		// nếu đã có px thì khi zoom về qh phải xoá px đi
		if (listMarkerDistrict?.detail && wardId) {
			listMarkerDistrict?.detail?.forEach((e) => {
				if (typeof e === "object") {
					e?.remove();
				}
			});
			setListMarkerDistrict((prev) => ({
				...prev,
				detail: null,
			}));
		}
		// fly zoom to district
	};

	//handle change ward
	const handleChangeWard = (id) => {
		const itemCity = dataWard?.find((i) => i?.ward_id == id);
		//delete marker before fly to city other
		setIsFly(true);
		flyMap(itemCity?.ward_lng, itemCity?.ward_lat, 13.5);
		// fly zoom to ward
		listMarkerDistrict?.detail?.forEach((e) => {
			if (typeof e === "object") {
				e?.remove();
			}
		});
		setListMarkerDistrict((prev) => ({
			...prev,
			detail: null,
		}));
	};

	const handleSubmitSearch = () => {
		e.preventDefault();
	};

	const handleSelectValueSearch = (e) => {
		setValue(e?.address);
		if (e?.ref_id?.includes("CITY")) {
			//nếu đang ở tỉnh đó và ở level zoom city thì không fly
			if (e?.boundaries[0]?.id === cityId && !districtId && !wardId)
				return;
			if (e?.boundaries[0]?.id === cityId && !districtId) return;
			handleChangeCity(e?.boundaries[0]?.id);
		}
		if (e?.ref_id?.includes("DIST")) {
			if (e?.boundaries[0]?.id === districtId && !wardId) return;
			if (e?.boundaries[1]?.id !== cityId) {
				setCityId(e?.boundaries[1]?.id);
			}
			setDistrictId(e?.boundaries[0]?.id);
			handleChangeDistrict(e?.boundaries[0]?.id);
		}
		if (e?.ref_id?.includes("WARD")) {
			if (e?.boundaries[0]?.id === wardId) return;
			if (e?.boundaries[2]?.id !== cityId) {
				setCityId(e?.boundaries[2]?.id);
			}
			if (e?.boundaries[1]?.id !== districtId) {
				setDistrictId(e?.boundaries[1]?.id);
			}
			setWardId(e?.boundaries[0]?.id);
			handleChangeWard(e?.boundaries[0]?.id);
		}
	};

	const handleSearch = (e) => setValue(e?.target?.value);

	return (
		<>
			<head>
				<script
					defer
					src="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js"
				></script>
				<link
					href="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css"
					rel="stylesheet"
				/>
			</head>

			<div className="h-[10vw] overflow-hidden text-black">
				{JSON.stringify(dataProject)}
			</div>
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
					<div className="relative">
						<form
							className="flex"
							onSubmit={handleSubmitSearch}
							autoComplete="false"
						>
							<input
								type="search"
								value={value}
								onChange={handleSearch}
								onFocus={() => setIsClose(false)}
								className="text-black border border-black border-solid outline-none"
							/>

							<button className="text-white bg-black">
								search
							</button>
						</form>
						{dataSearch && (
							<ul
								className={`${
									isClose ? "hidden" : ""
								} absolute bottom-0 left-0 translate-y-full z-[1000] bg-white text-black w-full`}
							>
								{dataSearch?.map((e, index) => (
									<li
										onClick={() => {
											setIsClose(true);
											handleSelectValueSearch(e);
										}}
										key={index}
									>
										{e?.address}
									</li>
								))}
							</ul>
						)}
					</div>
					<select
						onChange={(e) => handleChangeCity(e?.target?.value)}
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
					{dataDistrict && (
						<SelectComponent
							data={dataDistrict?.filter(
								(e) => e?.district_id != 0
							)}
							value={districtId}
							setValue={setDistrictId}
							handleFly={handleChangeDistrict}
							initial="Quận/huyện"
						/>
					)}
					<SelectComponent
						className={`${districtId && dataWard ? "" : "hidden"}`}
						data={dataWard}
						value={wardId}
						setValue={setWardId}
						handleFly={handleChangeWard}
						status={"ward"}
						initial="Phường/xã"
					/>
				</div>
			</div>
		</>
	);
}
