import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  if (req.method === "DELETE") {
    //get ids from url
    const roomId = req.query.roomId;
    const messageId = req.query.messageId;

    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this data",
      });
    }

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const room = rooms.find((room) => room.roomId === roomId);
    //check if messageId exist
    if (room != null) {
      const message = room.messages.find(
        (message) => messageId === message.messageId
      );
      if (message != null) {
        //check if token owner is admin, they can delete any message
        if (user.isAdmin === true) {
          room.messages = room.messages.filter(
            (message) => message.messageId !== messageId
          );
          writeChatRoomsDB(rooms);
          return res.status(200).send(
            JSON.stringify({
              ok: true,
            })
          );
        } else {
          //or if token owner is normal user, they can only delete their own message!
          if (user.username !== message.username) {
            return res.status(401).send(
              JSON.stringify({
                ok: false,
                message: "Yon do not have permission to access this data",
              })
            );
          } else {
            room.messages = room.messages.filter(
              (message) => message.messageId !== messageId
            );
            writeChatRoomsDB(rooms);
            return res.status(200).send(
              JSON.stringify({
                ok: true,
              })
            );
          }
        }
      } else {
        return res.status(404).send(
          JSON.stringify({
            ok: false,
            message: "Invalid message id",
          })
        );
      }
    } else {
      return res.status(404).send(
        JSON.stringify({
          ok: false,
          message: "Invalid room id",
        })
      );
    }
  }
}
