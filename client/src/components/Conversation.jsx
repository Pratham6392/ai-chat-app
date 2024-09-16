import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { HandleGetMessage, HandleSendMessage } from "../services/Api";
import useListenMessages from "../services/useListenMessages";

// eslint-disable-next-line no-unused-vars
const Conversation = ({ selectedChatId, setSelectedChatId, messages, setMessages }) => {
  const [message, setMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    await HandleSendMessage(message, selectedChatId._id, messages, setMessages);
    setMessage("");
  }

  useListenMessages(messages, setMessages);

  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const handleGet = async () => {
      await HandleGetMessage(selectedChatId._id, messages, setMessages);
    }
    if (selectedChatId) {
      handleGet();
    }
  }, [selectedChatId?._id, setMessages])

  return (
    <div className="mt-6 h-[100%]">
      {!selectedChatId ? (
        <div className="flex justify-center items-center text-xl">
          Welcome to Real Time Chat Application!
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="px-4 py-2 border-b border-gray-300 flex-shrink-0">
            <h3 className="text-xl font-bold mb-4 text-gray-900">{selectedChatId.name}</h3>
          </div>
          <div className="overflow-y-auto flex-grow">
            <div className="p-4">
              {messages.length === 0 && (
                <p>Start chatting with {selectedChatId.name}</p>
              )}
              {messages.map((message, index) => (
                <div key={message._id || index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                  <Message message={message} selectedChatId={selectedChatId} />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-300 px-4 py-2 flex-shrink-0">
            <form className="flex" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversation;