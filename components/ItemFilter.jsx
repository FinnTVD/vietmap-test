"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function ItemFilter({ item }) {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const lh = searchParams.get(item?.slug);
	const { data, isLoading, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API}${item?.api}`,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	useEffect(() => {
		const lhNew = lh?.split("--");
		const listInput = document.querySelectorAll("input[type=checkbox]");
		Array.from(listInput).map((e) => {
			console.log(lhNew?.includes(e?.id));
			if (lhNew?.includes(e?.id)) {
				e?.setAttribute("checked", "true");
			}
		});
	}, [lh, data]);
	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const handleCheckValueInput = (e) => {
		e.preventDefault();
		const b = [];

		Array.from(e?.target)?.map((i) => {
			if (i?.checked) {
				b.push(i?.id);
			}
		});

		let search = b.join("--");

		router.push(pathName + "?" + createQueryString(item?.slug, search));
	};

	return (
		<div>
			<div>{item?.title}</div>
			<form onSubmit={handleCheckValueInput}>
				{data &&
					data?.data?.map((e, index) => (
						<div key={index}>
							<label htmlFor={e?.id}>{e?.name}</label>
							<input type="checkbox" id={e?.id} />
						</div>
					))}
				<button>apply</button>
			</form>
		</div>
	);
}
