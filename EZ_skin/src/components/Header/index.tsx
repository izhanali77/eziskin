"use client";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import BasicModal from "../ModalInventory";
import Image from "next/image";
import LOGO from "@/assets/images/Logo.png";
import SteamLogin from "@/app/Steam/page";
import DepositModel from "./depositmodal";
import React, { useEffect, useState } from "react";
// import SkinsData from "./skinsdata";
import InventoryModal from "./inventoryModal";
import { useUserContext } from "@/context/UserContext";

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { isLoggedIn } = useUserContext()
  return (
    <header className="bg-[#3D3A40]">
      {/* <BasicModal
        handleOpen={handleOpen}
        open={open}
        handleClose={handleClose}
      /> */}
      <nav
        className="mx-auto flex w-full items-center justify-between px-5 py-0 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex">
            <span className="sr-only">Your Company</span>
            <Image src={LOGO} alt="Logo" width={150} height={50} />
          </a>
          <div className="hidden lg:flex gap-7 items-center ml-4">
            <button
              onClick={handleOpen}
              className="text-sm flex items-center font-semibold leading-6 text-[#9B9BA1]"
            >
              ToS
            </button>
            <a
              href="/FAQ"
              className="text-sm flex items-center font-semibold leading-6 text-[#9B9BA1]"
            >
              FAQ
            </a>
            {isLoggedIn && (
              <div>
                <button id="loginButton">
                  {/* <DepositModel /> */}
                  <InventoryModal />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="!flex lg:!hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#9B9BA1]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="!hidden lg:!flex lg:gap-x-12">
          <SteamLogin />
        </PopoverGroup>
      </nav>
      <Dialog
        className="lg:!hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />

        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#3D3A40] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image className="h-16 w-auto" src={LOGO} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon
                className="h-6 w-6 text-[#9B9BA1]"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="-mx-3  flex rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  <svg
                    fill="#9B9BA1"
                    width="24px"
                    height="24px"
                    viewBox="0 0 512 512"
                    version="1.1"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g id="gift_box-box_-heart-love-valentine">
                      <path d="M408,160h-64c15.55-0.021,28.483-12.719,28.504-28.269c0.021-15.55-12.568-28.139-28.118-28.118   c0.023-17.486-15.9-31.228-34.048-27.504C297.124,78.82,288,91.085,288,104.575v5.667c-4.256-3.838-9.831-6.242-16-6.242h-32   c-6.169,0-11.744,2.404-16,6.242v-5.667c0-13.491-9.124-25.755-22.339-28.467c-18.148-3.724-34.071,10.018-34.048,27.504   c-15.549-0.021-28.138,12.568-28.118,28.118C139.517,147.281,152.45,159.979,168,160h-64c-17.673,0-32,14.327-32,32v8   c0,17.673,14.327,32,32,32h96v16H96v161.28c0,16.966,13.754,30.72,30.72,30.72H200c8.837,0,16-7.163,16-16V168h80v256   c0,8.837,7.163,16,16,16h73.28c16.966,0,30.72-13.754,30.72-30.72V248H312v-16h96c17.673,0,32-14.327,32-32v-8   C440,174.327,425.673,160,408,160z M232,152v-24c0-4.41,3.586-8,8-8h32c4.414,0,8,3.59,8,8v24H232z" />
                    </g>
                    <g id="Layer_1" />
                  </svg>
                  Giveaway
                </a>
                <a
                  href="#"
                  className="-mx-3  flex rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  FAQ
                </a>
                <a
                  href="#"
                  className="-mx-3  flex rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  ToS
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                      fill="#9B9BA1"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 512 512"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <title>sound-loud-filled</title>
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="icon"
                        fill="#9B9BA1"
                        transform="translate(42.666667, 85.333333)"
                      >
                        <path
                          d="M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z"
                          id="Shape"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div className="py-6">
                <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#9B9BA1] hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
