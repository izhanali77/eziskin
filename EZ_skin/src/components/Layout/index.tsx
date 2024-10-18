"use client";
import "@/assets/css/tailwind.css";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "../Header";
import { UserProvider } from "@/context/UserContext";

type Prop = {
  children: JSX.Element;
};

export default function Layout({ children }: Prop) {
  const pathname = usePathname();
  const noHeaderPaths = ["/login", "/stripe"];

  return (
    <Box>
      <UserProvider>
      {pathname && !noHeaderPaths.includes(pathname) && <Header />}
      {children}
      </UserProvider>
    </Box>
  );
}
