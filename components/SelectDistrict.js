"use client";

import { useEffect, useState } from "react";
import useClickOutSide from "./useClickOutSide";

export default function SelectDistrict({
	className,
	data,
	wardId,
	districtId,
	setDistrictId,
	handleChangeDistrict,
	titleDistrict,
	setTitleDistrict,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [sideRef, isOutSide] = useClickOutSide();
	useEffect(() => {
		setIsOpen(false);
	}, [isOutSide]);


	return (
		<div ref={sideRef} className={`${className} relative text-black w-[5vw] ml-[1vw]`}>
			<span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>{titleDistrict?.title}</span>
			{isOpen && (
				<div
					className="absolute bottom-0 left-0 translate-y-[110%]"
				>
					{data?.map((e, index) => (
						<div
							className={`${!wardId && districtId === Number(e?.district_id) ?'bg-gray-300 cursor-default':'cursor-pointer'} whitespace-nowrap`}
							onClick={() => {
								if(districtId && !wardId) return
								setTitleDistrict({
									title:e?.district,
									id:e?.district_id
								});
								setDistrictId(Number(e?.district_id));
								handleChangeDistrict(e?.district_id);
							}}
							key={index}
						>
							{ e?.district + " - " + e?.district_id}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
