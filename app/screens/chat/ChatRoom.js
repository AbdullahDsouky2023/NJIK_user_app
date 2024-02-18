import React, { useEffect,useState } from "react";
import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { useSelector } from "react-redux";
import { useChatClient } from "./useChatClient";
import LoadingScreen from "../loading/LoadingScreen";
import { Audio } from "expo-av";

export default function ChatRoom() {
  const { clientIsReady, chatClient,setIsInChatRoom } = useChatClient();
  const [recording, setRecording] = useState(null);

  const currentChannelName = useSelector(
    (state) => state?.orders?.currentChatChannel
  );
  const currentChatChannel =
    chatClient?.activeChannels[`messaging:${currentChannelName}`];
    useEffect(() => {
      // Set the isInChatRoom state to true when the component mounts
      setIsInChatRoom(true);
      return () => {
      //   // Set the isInChatRoom state to false when the component unmounts
        setIsInChatRoom(false);
      };
    }, []);
    useEffect(() => {
      async function getPermission() {
        try {
          const { granted } = await Audio.requestPermissionsAsync();
          if (granted) {
            console.log("Audio permission granted!");
            // Handle permission granted
          } else {
            console.log("Audio permission denied.");
            // Handle permission denied
          }
        } catch (error) {
          console.error("Error requesting audio permission:", error);
        }
      }
    
      getPermission();
    }, []);


    // ...
    
    
    async function startRecording() {
      try {
        const recordingObject = new Audio.Recording();
        await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recordingObject.startAsync();
        setRecording(recordingObject);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
    
    async function stopRecording() {
      if (!recording) return;
  
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
  
        // Upload the audio file to Stream Chat
        const response = await chatClient.uploadFile(uri, {
          name: 'voice_message.mp3',
          type: 'audio/mp3',
        });
  
        // Send the audio file as a message in the chat
        await currentChatChannel.sendMessage({
          text: 'Voice message',
          attachments: [
            {
              type: 'file',
              file: response.file,
            },
          ],
        });
  
        // Reset the recording state
        setRecording(null);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
    
    
    if (!currentChatChannel || !clientIsReady) {
      return <LoadingScreen />;
  }
  return (
    <Channel channel={currentChatChannel}>
      <MessageList />
      <MessageInput />
      <TouchableOpacity onPress={startRecording}>Start Recording</TouchableOpacity>
  <TouchableOpacity onPress={stopRecording}>Stop Recording</TouchableOpacity>
    </Channel>
  );
}
