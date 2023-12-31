import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<script
					defer
					src="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js"
				></script>
				<link
					href="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css"
					rel="stylesheet"
				/>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
