import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import ProfileModal from "./profilemodal";
import TradeURLModal from "./settings";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SupportModal from "./supportmodal";
import InventoryModal from "./inventoryModal";
type Props = {
  user: string;
  userProfile: string;
};

export default function AccountSetting({ user, userProfile }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("steamID64");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setSteamID64("");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    setIsProfileModalOpen(true);
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <img className="rounded-full h-9 w-9" src={userProfile} alt="" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <img className="rounded-full w-9 h-9" src={userProfile} alt="" />
          <span className="font-[Poppins] capitalize font-semibold ml-2">
            {user}
          </span>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <span className="font-[Poppins]">My Profile</span>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <TradeURLModal />
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <InventoryModal />
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ContactSupportIcon fontSize="small" />
          </ListItemIcon>
          <SupportModal btntext="Support" />
        </MenuItem>
      </Menu>
      <ProfileModal
        open={isProfileModalOpen}
        onClose={handleModalClose}
        UserProfileLarge={userProfile}
      />
    </React.Fragment>
  );
}

function setIsLoggedIn(isLoggedIn: boolean) {
  console.log("Setting isLoggedIn to", isLoggedIn);
}

function setUsername(username: string) {
  console.log("Setting username to", username);
}

function setSteamID64(steamID64: string) {
  console.log("Setting steamID64 to", steamID64);
}
