import { useEffect, useState } from "react";
import { HandleSetStatus, HandleUsers } from "../services/Api";
import { useAuthContext } from "../services/AuthContext";
import { useSocketContext } from "../services/SocketContext";

const Chats = ({ selectedChatId, setSelectedChatId }) => {
  const [chatsData, setChatsData] = useState([]);
  const { authUser } = useAuthContext();
  const { availableUsers } = useSocketContext();
  const [status, setStatus] = useState("BUSY");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await HandleUsers();
        setChatsData(response);  // Assuming the response is the data you provided
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleStatus = async () => {
    try {
      await HandleSetStatus(status);
    } catch (error) {
      console.error("Failed to set user status:", error);
    }
  };

  const handleChatClick = (chat) => {
    setSelectedChatId(chat);
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-6">
        <img className="h-10 w-10 rounded-full" src={authUser.profilePic} alt={authUser.name} />
        <h3 className="flex text-xl font-bold text-gray-900 ">{authUser.name}</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2"
        >
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
        </select>
        <button className="bg-sky-500 rounded px-1 py-1" onClick={handleStatus}>save</button>
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">Chats</h3>
      <ul className="space-y-4">
        {chatsData.map(chat => {
          const isAvailable = availableUsers.includes(chat._id);
          return (
            <li
              key={chat._id}
              className={`flex items-center space-x-4 py-2 px-1 rounded cursor-pointer hover:bg-sky-400 ${selectedChatId?._id === chat?._id ? 'bg-sky-400' : ''}`}
              onClick={() => handleChatClick(chat)}
            >
              <div className={`h-12 w-12 p-0.5 rounded-full flex justify-center items-center ${isAvailable ? "border-[2px] border-green-800" : ""}`}>
                <img className="h-10 w-10 rounded-full" src={chat.profilePic} alt={chat.name} />
              </div>
              <div className="text-lg font-medium text-gray-900">{chat.name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Chats;