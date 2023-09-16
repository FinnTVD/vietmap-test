"use client";

import hoverEffect from "hover-effect";
import { useEffect, useState } from "react";

const arr = [
	{
		id:1,
		src:'/images/map1.png'
	},
	{
		id:2,
		src:'/images/map2.png'
	},
	{
		id:3,
		src:'/images/map3.png'
	},
]

export default function HoverV2() {
	const [count, setCount]= useState(0)
	const [prev, setPrev] = useState(arr[count]?.src)
	const [next, setNext] = useState(arr[count+1]?.src)
	const [animation, setAnimation] = useState(null);

	useEffect(()=>{
		setPrev(arr[count]?.src)
		setNext(arr[count]?.src)
	},[count])

	useEffect(() => {
		const elementToRemove = document.querySelectorAll('canvas');
		if(elementToRemove?.length>1){
			elementToRemove[0]?.remove()
		}
		let a = new hoverEffect({
			parent: document.querySelector(".ticket"),
			// intensity: 0,
			intensity1: 1,
			intensity2: 1,
			// angle2: Math.PI / 2,
			speedIn:0.5,// speed change
			speedOut:0.5,// speed change
			hover:false,

			image1: prev,
			image2: next,
			// image3: map3,
			// displacementImage:
			// 	"https://images.pexels.com/photos/1097203/pexels-photo-1097203.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260?raw=true",
			// displacementImage: "/images/map2.png",
			displacementImage: "/displacement/12.png",
		});
		setAnimation(a);
	}, [next,prev]);

	useEffect(()=>{
		const elementToRemove = document.querySelectorAll('canvas');
		if(elementToRemove?.length >=2 ){
			setTimeout(() => {
				elementToRemove[0]?.remove()
			}, 100);
		}
	},[next,prev])

	return (
		<>
			<div class="ticket">
				<div class="overlay"></div>
				<div class="flight-info">
					<div class="flight-locations">
						<img src="https://kangnam-cms.vercel.app/logo/svg-logo.svg" />
					</div>
				</div>
			</div>
			<div class="d-grid gap-2">
				<button
					// onClick={() => setIsHover(!isHover)}
					onClick={() => {
						animation.previous();
						if(count>0){
							setCount(count-1)
						}
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
						if(count<2){
							setCount(count+1)
						}
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
