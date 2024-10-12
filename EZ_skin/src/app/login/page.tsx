"use client";
import React, { useState } from "react";

import img from "@/assets/images/background.jpg";
import Image from "next/image";

export default function page() {
  const [showImage, setShowImage] = useState(true);
  const handleLogin = () => {
    window.location.href = "/";
    setShowImage(false);
  };
  return (
    <div className="w-full relative flex justify-center items-center h-[100vh]">
      <Image
        src={img}
        alt="background"
        className="absolute top-0 bg-cover w-full h-full"
      />
      <div className="bg-black rounded-xl bg-opacity-40 absolute px-6 pb-20 w-full max-w-[500px] items-center flex flex-col gap-10">
        <h1
          style={{ fontFamily: "cursive !important" }}
          className="text-white mt-4 !font-[cursive]"
        >
          Login
        </h1>
        <input
          style={{ fontFamily: "cursive !important" }}
          placeholder="Username"
          className="w-full !font-[cursive] text-white pl-4 h-10 bg-transparent border-b-2 border-white"
        />
        <input
          style={{ fontFamily: "cursive !important" }}
          placeholder="Password"
          type="password"
          className="w-full  !font-[cursive] text-white pl-4 h-10 bg-transparent border-b-2 border-white"
        />
        <button
          style={{ fontFamily: "cursive !important" }}
          className="w-1/2 my-5 rounded-xl bg-red-800 text-white py-3  !font-[cursive] "
          onClick={handleLogin}
        >
          {" "}
          Login
        </button>
      </div>
    </div>
  );
}
