import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this data",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const room = rooms.find((room) => room.roomId === roomId);

    //find room and return
    //...
    if (room == undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    } else {
      return res.json({ ok: true, message: room.messages });
    }
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this data",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const room = rooms.find((room) => room.roomId === roomId);

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });
    else if (room == undefined || null)
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    else {
      const text = req.body.text;
      const newId = uuidv4();
      const message = {
        messageId: newId,
        text: text,
        username: user.username,
      };

      //create message
      room.messages.push(message);
      writeChatRoomsDB(rooms);
      return res.json({ ok: true, message });
    }
  }
}
