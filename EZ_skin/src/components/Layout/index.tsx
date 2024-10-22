// "use client";
// import "@/assets/css/tailwind.css";
// import { Box } from "@mui/material";
// import { usePathname } from "next/navigation";
// import Header from "../Header";
// import { UserProvider } from "@/context/UserContext";

// type Prop = {
//   children: JSX.Element;
// };

// export default function Layout({ children }: Prop) {
//   const pathname = usePathname();
//   const noHeaderPaths = ["/login"];

//   return (
//     <Box>
//       <UserProvider>
//       {pathname && !noHeaderPaths.includes(pathname) && <Header />}
//       {children}
//       </UserProvider>
//     </Box>
//   );
// }


"use client";
import "@/assets/css/tailwind.css";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Header from "../Header";
import { UserProvider } from "@/context/UserContext";
import { useEffect, useState } from "react";

type Prop = {
  children: JSX.Element;
};

export default function Layout({ children }: Prop) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthProcessing, setIsAuthProcessing] = useState(true); // Initially assume auth process
  const noHeaderPaths = ["/login"];

  // Detect auth-callback path and process the redirect
  useEffect(() => {
    if (pathname?.startsWith("/auth-callback")) {
      setIsAuthProcessing(true); // Indicate auth callback is being processed
      
      // Simulate a brief delay to handle auth, JWT exchange, and redirect
      setTimeout(() => {
        router.replace("/"); // Redirect to the base URL after the process
        setIsAuthProcessing(false); // Auth processing is done
      }, 100); // You can adjust the delay if needed based on your exchange logic
    } else {
      setIsAuthProcessing(false); // No auth callback, render normally
    }
  }, [pathname, router]);

  return (
    <Box>
      <UserProvider>
        {/* Render Header if the path is not in `noHeaderPaths` */}
        {pathname && !noHeaderPaths.includes(pathname) && <Header />}

        {/* Avoid rendering children during auth processing */}
        {!isAuthProcessing && children}
      </UserProvider>
    </Box>
  );
}
