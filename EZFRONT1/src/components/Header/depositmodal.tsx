import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ModalSelect from "./select";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#3D3A40",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Add To Jackpot</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function DepositModel() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            height: 300,
            width: 400,
            borderRadius: 4,
            textAlign: "center",
            paddingTop: "50px",
          }}
        >
          <h2
            id="parent-modal-title"
            className="text-4xl font-bold text-center capitalize mb-4 text-white"
          >
            Add To Jackpot
          </h2>
          <ModalSelect />
          <a href="/stripe">
            <button className="mt-3 px-8 py-2 text-white  bg-green-500 hover:bg-green-700 transition hover:translate-y-1 rounded-xl">
              hdasdha
            </button>
          </a>
          <div
            className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-y-150  duration-300"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width={20}
              height={20}
              fill="white"
              viewBox="0 0 50 50"
              className="hover:fill-red-700"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
            </svg>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
