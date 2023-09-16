"use client";

import { useEffect, useState } from "react";
import useClickOutSide from "./useClickOutSide";

const handleTitleInit= (data, id)=>{
	const a = data?.find(e=>Number(e?.city_id)===Number(id))
	return a?.city
}

export default function SelectCity({
	className,
	data,
	handleChangeCity,
	titleCity,
	setTitleCity,
	districtId,
	wardId,
	cityId
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [sideRef, isOutSide] = useClickOutSide();
	useEffect(() => {
		setIsOpen(false);
	}, [isOutSide]);

	useEffect(()=>{
		if(data){
			const dataNew = data?.find(e=>Number(e?.city_id)===Number(cityId))
			setTitleCity({
				title:dataNew?.city,
				id:dataNew?.city_id
			})
		}
	},[])


	return (
		<div 
		ref={sideRef}
		className={`${className} relative text-black w-[5vw] ml-[1vw]`}>
			<span onClick={() => setIsOpen(!isOpen)}>{titleCity?.title || handleTitleInit() || "Tỉnh/thành phố"}</span>
			{isOpen && (
				<div
					className="absolute bottom-0 left-0 translate-y-[110%]"
				>
					{data?.map((e, index) => (
						<div
							className={`${cityId === Number(e?.city_id) && !districtId && !wardId?'bg-gray-300 cursor-default':'cursor-pointer'} whitespace-nowrap`}
							onClick={() => {
								if(!districtId) return
								setTitleCity({
									title:e?.city,
									id:e?.city_id
								});
								handleChangeCity(e?.city_id)
							}}
							key={index}
						>
							{e?.city}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
