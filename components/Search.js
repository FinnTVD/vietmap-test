'use client'

import { useEffect, useState } from "react";

export default function Search({
    handleSubmitSearch,
    value,
    handleSearch,
    handleSelectValueSearch,
    handleSelectValueProject,
    dataSearch,
    dataProject,
    dataProjectCode
}) {
	const [isClose, setIsClose] = useState(false);
    return (
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
                    {Array.isArray(dataProjectCode?.data) && <li className="font-bold text-black">Từ khoá</li>}
                    {Array.isArray(dataProjectCode?.data) && dataProjectCode?.data?.map((e, index) => (
                        <li
                            className="pl-[0.5vw] line-clamp-1"
                            title={e?.translation?.name}
                            onClick={() => {
                                setIsClose(true);
                                handleSelectValueProject(e);
                            }}
                            key={index}
                        >
                            {e?.translation?.name}
                        </li>
                    ))}
                    {dataSearch && <li className="font-bold text-black">Khu vực</li>}
                    {Array.isArray(dataSearch) && dataSearch?.slice(0,3)?.map((e, index) => (
                        <li
                            className="pl-[0.5vw]"
                            onClick={() => {
                                setIsClose(true);
                                handleSelectValueSearch(e);
                            }}
                            key={index}
                        >
                            {e?.address}
                        </li>
                    ))}
                    {Array.isArray(dataProjectCode?.data) && <li className="font-bold text-black">Dự án</li>}
                    {Array.isArray(dataProject?.data) && dataSearch?.length && dataProject?.data?.map((e, index) => (
                        <li
                            className="pl-[0.5vw] line-clamp-1"
                            title={e?.translation?.name}
                            onClick={() => {
                                setIsClose(true);
                                handleSelectValueProject(e);
                            }}
                            key={index}
                        >
                            {e?.translation?.name}
                        </li>
                    ))}
                    
                </ul>
            )}
        </div>
    )
}
