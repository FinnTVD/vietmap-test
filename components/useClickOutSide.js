"use client";

import { useEffect, useRef, useState } from "react";

export default function useClickOutSide() {
	const [isOutSide, setIsOutSide] = useState(false);
	const sideRef = useRef();
	useEffect(() => {
		if (typeof window === "undefined") return;
		document.addEventListener("click", handleClickOutSide, true);
	}, []);

	const handleClickOutSide = (e) => {
		if (!sideRef?.current?.contains(e.target)) {
			//out side
			setIsOutSide(true);
		} else {
			//in side
			setIsOutSide(false);
		}
	};
	return [sideRef, isOutSide];
}
