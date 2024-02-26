import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../context/AuthContext";
import { Button, Input, TextField, Typography } from "@mui/material";
import { TUser } from "../@types/user";

function Home() {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<TUser[]>([]);
  const [activeUser, setActiveUser] = useState<TUser>();

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
      {onlineUsers.map((user: TUser) => {
        return (
          <Button variant="contained" onClick={() => setActiveUser(user)}>
            {user.firstName}
          </Button>
        );
      })}
      {activeUser ? (
        <form onSubmit={handleSubmit}>
          <Input
            required
            name="message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">send</button>
        </form>
      ) : null}
      <Typography variant="h6">Message List</Typography>
      {messages.map((message) => {
        return <div>{message.message}</div>;
      })}
    </>
  );
}

export default Home;
