import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatCollaboration = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    participants: []
  });
  const [newParticipant, setNewParticipant] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages();
      // Set up polling for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${API}/chat/rooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedRoom) return;
    
    try {
      const response = await axios.get(`${API}/chat/rooms/${selectedRoom.id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/chat/rooms`, roomData);
      setShowCreateRoom(false);
      setRoomData({ name: '', description: '', participants: [] });
      fetchChatRooms();
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const messageData = {
        room_id: selectedRoom.id,
        content: newMessage,
        message_type: 'text'
      };
      
      await axios.post(`${API}/chat/messages`, messageData);
      setNewMessage('');
      fetchMessages(); // Refresh messages immediately
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !roomData.participants.includes(newParticipant)) {
      setRoomData({
        ...roomData,
        participants: [...roomData.participants, newParticipant.trim()]
      });
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant) => {
    setRoomData({
      ...roomData,
      participants: roomData.participants.filter(p => p !== participant)
    });
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          <p className="text-gray-600 mt-2">Real-time communication and collaboration tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen max-h-96">
          {/* Chat Rooms Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Chat Rooms</h2>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  +
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{room.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        👥 {room.participants.length} members
                      </span>
                    </div>
                  </div>
                ))}
                {chatRooms.length === 0 && (
                  <div className="text-center text-gray-500 py-8 text-sm">
                    No chat rooms yet. Create one to start collaborating!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <h2 className="text-lg font-bold">{selectedRoom.name}</h2>
                  <p className="text-sm text-gray-600">{selectedRoom.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500">
                      👥 {selectedRoom.participants.length} participants
                    </span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto max-h-64">
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender_id === user.id;
                      const showDate = index === 0 || 
                        formatMessageDate(messages[index - 1].timestamp) !== formatMessageDate(message.timestamp);
                      
                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center text-xs text-gray-500 my-4">
                              {formatMessageDate(message.timestamp)}
                            </div>
                          )}
                          <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isCurrentUser 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-900'
                            }`}>
                              {!isCurrentUser && (
                                <p className="text-xs font-medium mb-1 opacity-75">
                                  User {message.sender_id.slice(-8)}
                                </p>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                              }`}>
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Select a chat room to start collaborating</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Create Chat Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={roomData.name}
                    onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={roomData.description}
                    onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participants (User IDs)
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      placeholder="Enter user ID"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {roomData.participants.map((participant, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                        <span className="text-sm">{participant}</span>
                        <button
                          type="button"
                          onClick={() => removeParticipant(participant)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateRoom(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collaboration Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3">📹 Video Conferencing</h3>
            <p className="text-gray-600 mb-4">Host virtual meetings and collaborate face-to-face.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Start Meeting
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3">📝 Shared Workspace</h3>
            <p className="text-gray-600 mb-4">Collaborate on documents and projects in real-time.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Create Workspace
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3">📊 Project Management</h3>
            <p className="text-gray-600 mb-4">Track progress and manage team tasks efficiently.</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              View Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCollaboration;