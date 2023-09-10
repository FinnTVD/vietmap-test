"use client";

import hoverEffect from "hover-effect";
import { useEffect, useRef, useState } from "react";

export default function Hover() {
	const [animation, setAnimation] = useState(null);
	useEffect(() => {
		let a = new hoverEffect({
			parent: document.querySelector(".ticket"),
			// intensity: 0.3,
			intensity1: 0.1,
			intensity2: 0.1,
			angle2: Math.PI / 2,
			image1: "https://upload.wikimedia.org/wikipedia/commons/3/30/Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg",
			image2: "https://images.unsplash.com/photo-1440330033336-7dcff4630cef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1342&q=80",
			// displacementImage:
			// 	"https://images.pexels.com/photos/1097203/pexels-photo-1097203.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260?raw=true",
			displacementImage: "/displacement/14.jpg",
		});
		setAnimation(a);
	}, []);
	return (
		<>
			<div class="ticket">
				<div class="overlay"></div>
				<div class="flight-info">
					<h3>JUNE 30 2018 12:30PM</h3>
					<div class="flight-locations">
						<h1>OK</h1>
						<img src="https://kangnam-cms.vercel.app/logo/svg-logo.svg" />
						<h1>HUB</h1>
					</div>
				</div>
			</div>
			<div class="d-grid gap-2">
				<button
					// onClick={() => setIsHover(!isHover)}
					onClick={() => {
						animation.previous();
					}}
					type="button"
					name=""
					id=""
					class="btn btn-primary"
				>
					Previous
				</button>
				<button
					// onClick={() => setIsHover(!isHover)}
					onClick={() => {
						animation.next();
					}}
					type="button"
					name=""
					id=""
					class="btn btn-primary"
				>
					Next
				</button>
			</div>
		</>
	);
}
