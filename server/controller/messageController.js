import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.js";
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

export const getMessage = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};



export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

        await Promise.all([conversation.save(), newMessage.save()]);

		const receiverSocketId = getReceiverSocketId(receiverId);

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}
		
		const senderSocketId = getReceiverSocketId(senderId);
        if(senderSocketId){
            io.to(senderSocketId).emit("newMessage", newMessage);
        }
    
		const receiverDetails = await User.findById(receiverId);
		if(receiverDetails.status === "BUSY"){
			try {
                
                const autoResponse = await generateResponse(message);
                const receiverResponse = await saveReceiverMessage(receiverId, senderId, autoResponse);
                 if (senderSocketId) {
                    io.to(senderSocketId).emit("newMessage", newMessage);
		        }
                
                return res.status(200).json(receiverResponse);
            } catch (error) {
                return res.status(200).json({ message: "User is unavailable" });
            }
		}
		
		res.status(200).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const anthropic = new Anthropic({
	apiKey: process.env.CLAUDE_KEY
});

async function generateResponse(prompt) {

    try {
        const llmPromise = await anthropic.messages.create({
			model: "claude-3-opus-20240229",
			max_tokens: 1,
			messages: [
			  {"role": "user", "content": prompt}
			]
		  });

        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve(null), 10000);
        });

        const result = await Promise.race([llmPromise, timeoutPromise]);

        if (!result) {
            console.error('Auto response timed out after 10 seconds');
            return "User is unavailable";
        }

        return result.content[0].text;
    } catch (error) {
        console.error('Error in generateAutoReply:', error.message);
    }
}

async function saveReceiverMessage(senderId, receiverId, text) {

    const newMessage = new Message({
        senderId,  // ID of the recipient acting as sender
        receiverId,  // ID of the original sender
        message: text
    });
    await newMessage.save();
    
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId]
        });
    }

    conversation.messages.push(newMessage._id);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    const senderSocketId = getReceiverSocketId(senderId);
    if(senderSocketId){
        io.to(senderSocketId).emit("newMessage", newMessage);
    }

    await conversation.save();

    return newMessage;
}