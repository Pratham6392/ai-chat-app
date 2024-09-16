import { useAuthContext } from "../services/AuthContext";
import moment from "moment";

const Message = ({ message, selectedChatId }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser._id;
  const profilePic = fromMe ? authUser.profilePic : selectedChatId.profilePic;
  const messagePosition = fromMe ? "justify-end" : "justify-start";
  const bgColor = fromMe ? "bg-green-500" : "bg-white";
  const messageTime = moment(message.createdAt).format("LT");
  const timeColor = fromMe ? "text-white" : "text-gray-500";

  return (
    <div className={`flex ${messagePosition} space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm`}>
      <img className="h-10 w-10 rounded-full" src={profilePic} alt="User" />
      <div className={`flex flex-col text-m text-gray-700 ${bgColor} p-3 rounded-lg shadow-md`}>
        <div>{message?.message}</div>
        <div className={`text-xs ${timeColor}`}>{messageTime}</div>
      </div>
    </div>
  );
};

export default Message;
