import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserSidebar", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async(req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const sendMessage = async(req, res) => {
    try {
        const {text, img} = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;
        let imgURL;
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            imgURL = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            img: imgURL,
        });
        await newMessage.save();
        const receiverSocketId = getRecieverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}