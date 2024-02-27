import React from "react";
import { TUser } from "../@types/user";
import {
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { green } from "@mui/material/colors";

function ActiveUser({
  user,
  setActiveUser,
}: {
  user: TUser;
  setActiveUser: (user: TUser) => void;
}) {
  console.log(user);
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveUser(user)}>
              <ListItemIcon>
                <CircleIcon
                  fontSize="small"
                  sx={{ color: "green", fontSize: 12 }}
                />
              </ListItemIcon>
              <ListItemText primary={user.firstName} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
    </Box>
  );
}

export default ActiveUser;
