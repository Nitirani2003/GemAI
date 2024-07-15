import User from "../models/User.js";
import { configureGemini } from '../config/openai-config.js';
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        //grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content })); //map through user chat
        chats.push({ content: message, role: "user" }); //storing the chats in this static array
        user.chats.push({ content: message, role: "user" });
        //send all chats with new one to openAi  api
        const genAI = configureGemini();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        //get latest respose
        const prompt = chats.map(chat => chat.content).join('\n');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        //push to the chats of the user
        user.chats.push({ role: "assistant", content: text });
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map