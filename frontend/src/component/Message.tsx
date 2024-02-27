import { Box, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useAuthContext } from "../context/AuthContext";

function Message({ message }: { message: any }) {
  const { user } = useAuthContext();
  console.log(user);
  console.log(message);
  return (
    <Box
      sx={{
        width: "100%",
        border: "red",
        borderWidth: "1px",
        borderColor: "red",
        padding: "100",
      }}
    >
      {user?.id === message.senderId ? (
        <Stack direction={"row"} alignItems={"center"} gap={"0.1rem"}>
          {/* <AccountCircleIcon sx={{ fontSize: "2rem" }} /> */}
          <Box sx={{ maxWidth: "45%" }}>
            <Box
              sx={{
                backgroundColor: "lightgray",
                paddingY: "0.2rem",
                paddingX: "0.5rem",
                borderRadius: "7px",
                borderBottomLeftRadius: "0px",
                width: "fit-content",
                fontWeight: "500",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
            >
              {message.message}
            </Box>
          </Box>
        </Stack>
      ) : (
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <Box sx={{ maxWidth: "45%" }}>
            <Box
              sx={{
                backgroundColor: "lightgreen",
                paddingY: "0.2rem",
                paddingX: "0.5rem",
                borderRadius: "7px",
                borderBottomRightRadius: "0px",
                width: "fit-content",
                fontWeight: "500",
                marginBottom: "1rem",
                cursor: "pointer",
                marginRight: 2,
              }}
            >
              {message.message}
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default Message;
