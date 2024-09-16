import Conversation from '../components/Conversation';
import Chats from '../components/Chats';
import { HandleLogout } from '../services/Api';
import { useAuthContext } from '../services/AuthContext';
import { useState } from 'react';

const Home = () => {
  const { setAuthUser } = useAuthContext();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleLogout = async () => {
    await HandleLogout(setAuthUser);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className='flex gap-4'>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full h-[95vh] overflow-auto">
          <Chats selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
          <div className="mt-6 flex">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-[200vh] h-[95vh] overflow-hidden'>
          <Conversation selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
};

export default Home;
