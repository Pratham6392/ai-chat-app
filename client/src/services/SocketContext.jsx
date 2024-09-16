/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
	const [availableUsers, setAvailableUsers] = useState([]);
	const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
			const socket = io("http://localhost:6000" , {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			socket.on("availableUsers", (users) => {
				setAvailableUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
    }, [authUser]);

    return <SocketContext.Provider value={{ socket, availableUsers }}>{children}</SocketContext.Provider>;
};