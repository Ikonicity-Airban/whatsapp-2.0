import { Avatar, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcons from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
// import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import { useRef, useState, useEffect } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import InputEmoji from "react-input-emoji";
// import { ReactMic } from "react-mic";
// import EmojiPicker from "./EmojiPicker";

//

function ChatScreen({ chat, messages }) {
  const endOfMessagesRef = useRef(null);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isMicShowing, setIsMicShowing] = useState(true);
  const [record, setRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };
  // -------------------------------------------//
  // the record functionality//
  useEffect(() => {
    const startRecording = () => {
      setRecord(true);
    };

    const stopRecording = () => {
      setRecord(false);
    };
    function onData(recordedBlob) {
      console.log("chunk of real-time data is: ", recordedBlob);
    }

    function onStop(recordedBlob) {
      console.log("recordedBlob is: ", recordedBlob);
      const { blobURL } = recordedBlob;
      setAudioUrl(blobURL);
    }
  }, []);

  // -----------------------------------------//

  const scrollToBottom = () => {
    // if(endOfMessagesRef.current){
    //   return null
    // }
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    // e.preventDefault(); // react-emoji-input have their own preventDefault in place
    if (!input) {
      return;
    }
    //updates last seen;
    db.collection("user").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };
  const sendMessageFromIcon = (e) => {
    e.preventDefault(); // react-emoji-input have their own preventDefault in place
    if (!input) {
      return;
    }
    //updates last seen;
    db.collection("user").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  //
  //
  //
  //

  // return
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active: {""}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active ...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcons />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
        {/* {"" || } */}
        <audio src={audioUrl}></audio>
      </MessageContainer>
      <InputContainer>
        <InputEmoji
          className="emoji"
          value={input}
          onChange={setInput}
          cleanOnEnter
          onEnter={sendMessage}
          placeholder="Type a message"
          fontFamily="helvetica"
        />
        {/* <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        /> */}
        {/* <button onClick={startRecording} type="button">
          Start
        </button>
        <button onClick={stopRecording} type="button">
          Stop
        </button> */}
        <MicIcon />
        <Button type="submit" onClick={sendMessageFromIcon}>
          <SendIcon />
        </Button>
        {/* <EmojiPicker /> 
        <Input value={input} onChange={(e) => setInput(e.target.value)} /> */}
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;
//
//
//
//
//
//

// styles
const Container = styled.div`
width: 100vw
height: 100vh;
`;

const Header = styled.div`
  position: sticky;
  z-index: 1000;
  background-color: #f77131f2;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 3px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 80px;
  height: 20px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  justify-content: space-between;
`;

const Input = styled.input`
  flex: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin: 0px, 15px, 0px;
`;
const Button = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
`;
