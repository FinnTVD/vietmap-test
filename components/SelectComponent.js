"use client";

import { useEffect, useState } from "react";
import useClickOutSide from "./useClickOutSide";

export default function SelectComponent({
	className,
	data,
	value,
	setValue,
	status,
	initial,
	handleFly,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [sideRef, isOutSide] = useClickOutSide();
	const [title, setTitle] = useState(initial);
	useEffect(() => {
		setIsOpen(false);
	}, [isOutSide]);

	useEffect(() => {
		setTitle(initial);
	}, [value]);
	return (
		<div className={`${className} relative text-black w-[5vw] ml-[1vw]`}>
			<span onClick={() => setIsOpen(!isOpen)}>{title}</span>
			{isOpen && (
				<div
					ref={sideRef}
					className="absolute bottom-0 left-0 translate-y-[110%]"
				>
					{data?.map((e, index) => (
						<div
							className="whitespace-nowrap"
							onClick={() => {
								if (status === "ward") {
									setTitle(e?.ward);
									setValue(Number(e?.ward_id));
									handleFly(e?.ward_id);
								} else {
									setTitle(e?.district);
									setValue(Number(e?.district_id));
									handleFly(e?.district_id);
								}
							}}
							key={index}
						>
							{status === "ward"
								? e?.ward + " - " + e?.ward_id
								: e?.district + " - " + e?.district_id}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
