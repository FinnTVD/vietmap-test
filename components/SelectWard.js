"use client";

import { useEffect, useState } from "react";
import useClickOutSide from "./useClickOutSide";

export default function SelectWard({
	className,
	data,
	wardId,
	setWardId,
	handleChangeWard,
	titleWard,
	setTitleWard,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [sideRef, isOutSide] = useClickOutSide();
	useEffect(() => {
		setIsOpen(false);
	}, [isOutSide]);


	return (
		<div ref={sideRef} className={`${className} relative text-black w-[5vw] ml-[1vw]`}>
			<span onClick={() => setIsOpen(!isOpen)}>{titleWard?.title}</span>
			{isOpen && (
				<div
					className="absolute bottom-0 left-0 translate-y-[110%]"
				>
					{data?.map((e, index) => (
						<div
							className={`${wardId === Number(e?.ward_id)?'bg-gray-300 cursor-default':'cursor-pointer'} whitespace-nowrap`}
							onClick={() => {
								if(wardId === Number(e?.ward_id)) return
								setTitleWard({
									title:e?.ward,
									id:e?.ward_id
								});
								setWardId(Number(e?.ward_id));
								handleChangeWard(e?.ward_id);
							}}
							key={index}
						>
							{e?.ward + " - " + e?.ward_id}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
