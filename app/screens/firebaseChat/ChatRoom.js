import React, { useState, useEffect } from 'react';
import { getFirestore, collection,getDoc, addDoc, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FIRE_BASE_Storage, auth ,db} from '../../../firebaseConfig';
import { GiftedChat, Bubble, MessageText, InputToolbar, Send, Actions } from 'react-native-gifted-chat';
import { Colors } from '../../constant/styles';
import { TextInput, View, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { CustomBubble, CustomInputToolbar,renderMessageImage, CustomMessageText, CustomSend } from './CustomComponents';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import FormImagePicker from '../../component/Form/FormImagePicker';
import CustomImagePicker from './ImagePicker';
import { EXPO_PUBLIC_SECRET_PASSWORD,EXPO_PUBLIC_BASE_URL } from "@env";
import { Ionicons } from '@expo/vector-icons';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import LoadingScreen from '../loading/LoadingScreen';

const { height, width } = Dimensions.get('screen');

const ChatRoom = () => {

        const currentChannelName = useSelector((state) => state?.orders?.currentChatChannel);
        const { t } = useTranslation();
        // const { uid} = auth
        const [CurrentChatRoom,SetCurrentChatRoom] = useState(null)
        const [messages, setMessages] = useState(null);
        const user = useSelector((state)=>state?.user?.userData)
        const [text, setText] = useState('');





        useEffect(() => {
            const ref = collection(db, 'chatRooms');
            // console.log("Chat room ref");
          
            const unsubscribe = onSnapshot(ref, (chatRooms) => {
              const data = chatRooms?.docs?.map((doc) => {
                return {
                ...doc.data(),
                  _id: doc.id, // Add a unique ID for GiftedChat
                };            
              });
            //   console.log("chat Rooms ", data);
            
          
              // Check if the chat room exists
              const chatRoomExists = data.some(room => room.name === currentChannelName);
              if (!chatRoomExists) {
                // If the chat room does not exist, create it
                // console.log("Creating chat room:", currentChannelName);
                addDoc(ref, {
                  name: currentChannelName,
                  createdAt: new Date(),
                  
                }).catch((error) => {
                  console.log("Error creating chat room:", error);
                });
              }else {
                const room = data?.filter((room)=>room?.name === currentChannelName)
                console.log("snap shot is found ",room)
                SetCurrentChatRoom(room)

              }
            });
          
            return unsubscribe;
          }, [currentChannelName]);
          
          useEffect(() => {
              if(CurrentChatRoom?.length > 0){
            const messagesCollection =  collection(db, `chatRooms/${CurrentChatRoom[0]?._id}/messages`);
                const unsubscribe = onSnapshot(messagesCollection, (querySnapshot) => {
                    const orderedMessages = querySnapshot.docs.sort((a, b) => {
                        return a.data().createdAt > b.data().createdAt ? -1 : 1;
                    }).map((doc) => ({
                        ...doc.data(),
                        _id: doc.id,
                        createdAt: doc.data().createdAt?.toDate(),
                    }));
                    setMessages(orderedMessages);
                });
                
                
                return unsubscribe;
            }
            
          }, [CurrentChatRoom])

const onSend = async (newMessagesArray = []) => {
      // Handle image messages
      console.log("the new message ",newMessagesArray)
      const newMessages = [{
        _id: Math.random().toString(), // Generate a unique ID
                  text: newMessagesArray?.text, // No text for image messages
                createdAt: new Date(), // Current date and time
                user: {
                  _id: user?.id, // The ID of the current user
                },
              }
      ]
      try{

          const imageMessages = newMessages.filter((message) => message.image);
          
          if (imageMessages.length >  0) {
              // Upload images to storage and update message with download URL
              const promises = imageMessages.map(async (message) => {
                const response = await uploadImage(message.image);
                return {
                  ...message,
                  image: response.downloadURL,
                  user: {
                    _id: user?.id, // Add the user ID here
                  },
                };
              });
              const uploadedMessages = await Promise.all(promises);
          
              // Send image messages to Firestore
              uploadedMessages.forEach(async (message) => {
                await addMessageToFirestore(message);
              });
          
              // Send text messages (if any)
              const textMessages = newMessages.filter((message) => !message.image);
              await GiftedChat.append(messages, textMessages);
              setText('');

            } else {
                console.log("new message are " , newMessages)
              // Send text messages only
              const newMessage = {
                  _id: Math.random().toString(), // Generate a unique ID
                  text: newMessages[0]?.text, // No text for image messages
                createdAt: new Date(), // Current date and time
                user: {
                  _id: user?.id, // The ID of the current user
                },
              };
          
              await addMessageToFirestore(newMessage)
              await GiftedChat.append(messages, newMessages);
              setText('');
              
            }
        }catch(err){
            console.log(err)
        }finally{
            
            setText('');
        }
 };
          
const uploadImage = async (image, values, ImageName) => {
    try {
        const imageIds = [];
      console.log("the items is ",image)
      console.log("the images array ",image)
      for (const imageUri of image) {
        const formData = new FormData();
        formData.append("files", {
          name: `Nijk_IMAGE_ORDER`,
          type: "image/jpeg",
          uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        });
  
        try {
          const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/api/upload`, {
            method: "POST",
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Image upload failed with status: ${response.status}`);
          }
  
          const responseData = await response.json();
          const imageId = responseData[0]?.id;
          imageIds.push(imageId);
          console.log("the image id :",responseData[0]?.url)
          return responseData[0]?.url
        } catch (error) {
          console.error("Error uploading image:", error);
          // Handle error gracefully
        }
      }
    //   console.log("the image ids are ",imageIds)
      dispatch(setCurrentRegisterProperties({ [ImageName]: imageIds }));
  
      // Return the download URLs instead of dispatching to Redux store
      const downloadURLs = await Promise.all(imageIds.map(async (id) => {
        const url = `${EXPO_PUBLIC_BASE_URL}/api/images/${id}`;
        return url;
      }));
  
      return downloadURLs;
    } catch (error) {
      // ... error handling ...
    }
  };
 const addMessageToFirestore = async (message) => {
            const messagesCollection = collection(db, `chatRooms/${CurrentChatRoom[0]?._id}/messages`);
            await addDoc(messagesCollection, {
              ...message,
              createdAt: new Date(),
            });
          };
// Add this function inside your ChatRoom component
const handleImageSelected = async (imageUri) => {
    try {
      // Upload the image and get the download URL
      const downloadURL = await uploadImage([imageUri], {}, 'image');
        // console.log("the download image uri ",downloadURL)
      // Create a new message object with the image URL
      const newMessage = {
        _id: Math.random().toString(), // Generate a unique ID
        text: null, // No text for image messages
        createdAt: new Date(), // Current date and time
        image: downloadURL,
        user: {
          _id: user?.id, // The ID of the current user
        },
      };
  
      // Append the new message to the messages array
      setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
  
      // Save the new message to Firestore
      await addMessageToFirestore(newMessage);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  if(!currentChannelName || !messages || !CurrentChatRoom){
    return <LoadingScreen/>
  }
         
  return (
<View style={{ flex: 1 , display:'flex'}}>

    <GiftedChat
    alwaysShowSend
    messages={messages}
      onSend={onSend}
      user={{
          _id: user?.id, // Use user ID from your authentication system
        }}
        renderSend= {(props) =>{
            return (
                text?.length > 0 &&

                <Send
                    {...props}
                    style={{marginBottom:height*0.1}}
                    onSend={(mes) => onSend(mes)}
                    text={text}
                >
                    <View style={{marginBottom:-height*0.024,backgroundColor:Colors.primaryColor,padding:1, borderRadius:width*0.09*0.5,display:'flex',alignItems:'center',justifyContent:'center', height:width*0.09,width:width*0.09}}>

                    <Ionicons name="send" size={21} color="white"  />
                    </View>

                </Send>
            );
        }}
        renderActions={() => (
            text?.length === 0 &&
            <Actions
              onPressActionButton={()=>console.log("show image picker")}
              containerStyle={{marginBottom:-height*0.006, marginHorizontal:5,backgroundColor:Colors.primaryColor,padding:1, borderRadius:width*0.09*0.5,display:'flex',alignItems:'center',justifyContent:'center', height:width*0.09,width:width*0.09}}
              icon={() => (
                <CustomImagePicker onImageSelected={handleImageSelected} />
                )}
            
            />
          )    }    
          messagesContainerStyle={{backgroundColor:Colors.whiteColor,paddingBottom:height*0.07}}
          // renderBubble={props => <CustomBubble {...props} />}
        // renderCustomView={props => <View {...props} />}
        // renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
        // renderMessageText={(props) => <CustomMessageText {...props} />}
        renderInputToolbar={(props)=>{
            return <CustomInputToolbar 
            setText={setText} text={text} {...props} containerStyle={{borderTopWidth:0, borderTopColor: '#333',}} />

        }}
        />
        <View>

        </View>

       
     </View>
  ); 
};

export default ChatRoom;
