"use client"

import { auth } from "@/firebase";
import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeadStarter from "@/public/HeadStarter Logo.png"

export default function Navbar() {
  const [anchorE1, setAnchorE1] = useState(null);

  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth).then(() => {
      router.push("/sign-in");
    });
  };

  const handleMain = () => {
    router.push("/");
  };

  const handleMenu = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handleClosing = () => {
    setAnchorE1(null);
  };

  return (
    <AppBar position="static">
      <Toolbar 
        sx={{
            backgroundColor: "#128283"
        }}
      >
        <Image 
            src={HeadStarter}
            width={200}
            alt="HeadStarter Logo"
            className="pointer"
            onClick={handleMain}
        />
        {auth && (
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ color: "black" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorE1={anchorE1}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              open={Boolean(anchorE1)}
              onClose={handleClosing}
              sx={{
                "& .MuiPaper-root": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    borderRadius: "10px",
                    border: "2px solid white",
                    overflow: "hidden",
                    color: "white",
                },
              }}
            >
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
