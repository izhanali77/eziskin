"use client";
import "@/assets/css/tailwind.css";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "../Header";

type Prop = {
  children: JSX.Element;
};

export default function Layout({ children }: Prop) {
  const pathname = usePathname();
  const noHeaderPaths = ["/login", "/stripe"];

  return (
    <Box>
      {pathname && !noHeaderPaths.includes(pathname) && <Header />}
      {children}
    </Box>
  );
}
