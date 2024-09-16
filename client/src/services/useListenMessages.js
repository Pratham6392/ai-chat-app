import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const useListenMessages = (messages, setMessages) => {
	const { socket } = useSocketContext();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;