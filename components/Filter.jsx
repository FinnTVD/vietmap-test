"use client";

import { useCallback } from "react";
import ItemFilter from "./ItemFilter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
const a = [
	{
		id: 1,
		title: "Loại hình",
		slug: "propertyTypeIds",
		api: "/property-type",
	},
	{
		id: 2,
		title: "Địa điểm",
		slug: "propertyAreaTypeIds",
		api: "/property-area-type",
	},
	{
		id: 3,
		title: "Hình thức",
		slug: "propertyCategoryIds",
		api: "/property-category",
	},
];
const fetcher = (...args) => fetch(...args).then((res) => res.json());
let propertyTypeParams = "";
let propertyAreaTypeParams = "";
let propertyCategoryTypeParams = "";
export default function Filter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const page = searchParams.get("page");
	const price = searchParams.get("price");

	const propertyType = searchParams.getAll("propertyTypeIds");
	const propertyAreaType = searchParams.getAll("propertyAreaTypeIds");
	const propertyCategoryType = searchParams.getAll("propertyCategoryIds");

	if (propertyType?.length > 0 && propertyType[0]) {
		propertyTypeParams = propertyType[0]
			.split("--")
			.reduce(
				(accumulator, currentValue) =>
					accumulator + "&propertyTypeIds=" + currentValue,
				""
			);
	} else {
		propertyTypeParams = "";
	}

	if (propertyAreaType?.length > 0 && propertyAreaType[0]) {
		propertyAreaTypeParams = propertyAreaType[0]
			.split("--")
			.reduce(
				(accumulator, currentValue) =>
					accumulator + "&propertyAreaTypeIds=" + currentValue,
				""
			);
	} else {
		propertyAreaTypeParams = "";
	}

	if (propertyCategoryType?.length > 0 && propertyCategoryType[0]) {
		propertyCategoryTypeParams = propertyCategoryType[0]
			.split("--")
			.reduce(
				(accumulator, currentValue) =>
					accumulator + "&propertyCategoryIds=" + currentValue,
				""
			);
	} else {
		propertyCategoryTypeParams = "";
	}

	const { data, isLoading, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API}/property?order=DESC&page=${
			page ? page : 1
		}&take=3${
			propertyCategoryTypeParams ? propertyCategoryTypeParams : ""
		}${propertyAreaTypeParams ? propertyAreaTypeParams : ""}${
			propertyTypeParams ? propertyTypeParams : ""
		}${price ? "&price=" + price : ""}`,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);
	console.log("🚀 ~ file: Filter.jsx:46 ~ Filter ~ data:", data);

	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);
	const listPage = new Array(data?.meta?.pageCount).fill(0);

	return (
		<div className="w-full">
			<div className="flex">
				<div className="flex gap-x-[1vw]">
					{a?.map((e) => (
						<ItemFilter key={e?.id} item={e} />
					))}
				</div>
				<div>
					{listPage?.map((e, index) => (
						<div
							key={index + 1}
							className={`${
								page && page == index + 1
									? "bg-orange-500"
									: !page && index + 1 == 1
									? "bg-orange-500"
									: ""
							} rounded-full select-none cursor-pointer bg-white w-[2vw] h-[2vw] flex justify-center items-center text-black`}
							onClick={() => {
								router.push(
									pathName +
										"?" +
										createQueryString("page", index + 1)
								);
							}}
						>
							{index + 1}
						</div>
					))}
				</div>
				<div>
					<select
						onChange={(e) => {
							if (e?.target?.value === "new") {
								router.push(
									pathName +
										"?" +
										createQueryString("price", "")
								);
							} else {
								router.push(
									pathName +
										"?" +
										createQueryString(
											"price",
											e?.target?.value
										)
								);
							}
						}}
						className="w-[10vw] text-black"
						name=""
						id=""
					>
						<option value="" className="text-black">
							Mới nhất
						</option>
						<option value="ASC" className="text-black">
							Giá tăng dần
						</option>
						<option value="DESC" className="text-black">
							Giá giảm dần
						</option>
					</select>
				</div>
			</div>
			<div className="grid grid-cols-4 grid-rows-4 gap-[1vw]">
				{data &&
					data?.data?.map((e, index) => (
						<div key={index} className="w-full h-[5vw] relative">
							<Image
								src={e?.firstImage || "/images/img2.webp"}
								alt="a"
								fill
								className="object-cover"
							/>
						</div>
					))}
			</div>
		</div>
	);
}
