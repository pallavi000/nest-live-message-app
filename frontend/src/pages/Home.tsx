import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  Card,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { TUser } from "../@types/user";
import Chatlist from "../component/Chatlist";
import Message from "../component/Message";
import ActiveUser from "../component/ActiveUser";

function Home() {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<TUser[]>([]);
  const [activeUser, setActiveUser] = useState<TUser | undefined>();

  const socket = useRef<any>();

  useEffect(() => {
    socket.current = io("http://localhost:3000");
    if (socket.current) {
      socket.current.on("connect", () => {
        if (user && socket.current) {
          socket.current.emit("join-user", user);

          socket.current.on("online-users", (users: any) => {
            console.log(users, "users");
            setOnlineUsers(users);
          });

          socket.current.on("new-message", (message: any) => {
            setMessages((prev) => [...prev, message]);
          });
        }
      });
    }

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (user && activeUser && socket) {
      const data = {
        message: {
          message,
          senderId: user.id,
          receiverId: activeUser.id,
        },
        userId: activeUser.id,
      };
      setMessages((prev) => [...prev, data.message]);
      socket.current.emit("message", data);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item md={4}>
          <Typography variant="h6">Active User</Typography>
          {onlineUsers.map((user: TUser) => {
            return <ActiveUser user={user} setActiveUser={setActiveUser} />;
          })}
        </Grid>

        <Grid item md={4}>
          <Typography variant="h6">Message List</Typography>
          {messages.map((message) => {
            return <Message message={message} />;
          })}
          <Box sx={{ width: "100%" }}>
            {activeUser ? (
              <Card
                sx={{ width: "100%", display: "flex", gap: "1rem" }}
                component="form"
                onSubmit={handleSubmit}
              >
                <Input
                  sx={{ width: "100%" }}
                  required
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">send</button>
              </Card>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
