// const onSend = async (newMessagesArray = []) => {
//     // Handle image messages
//     console.log("the new message ",newMessagesArray);

//     try {
//         const newMessages = [{
//             _id: Math.random().toString(), // Generate a unique ID
//             text: newMessagesArray?.text, // No text for image messages
//             createdAt: new Date(), // Current date and time
//             user: {
//                 _id: user?.id, // The ID of the current user
//             },
//             loading: true, // Indicator for loading state
//         }];

//         // Update the state with the temporary message
//         setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));

//         const imageMessages = newMessages.filter((message) => message.image);

//         if (imageMessages.length > 0) {
//             setText('');
//             // Upload images to storage and update message with download URL
//             const promises = imageMessages.map(async (message) => {
//                 const response = await uploadImage(message.image);
//                 return {
//                     ...message,
//                     image: response.downloadURL,
//                     loading: false, // Set loading to false after successful upload
//                     user: {
//                         _id: user?.id, // Add the user ID here
//                     },
//                 };
//             });
//             const uploadedMessages = await Promise.all(promises);
//             const newMessage = {
//                 _id: Math.random().toString(), // Generate a unique ID
//                 text: null, // No text for image messages
//                 createdAt: new Date(), // Current date and time
//                 image: "",
//                 user: {
//                   _id: user?.id, // The ID of the current user
//                 },
//               };
          
//               // Append the new message to the messages array
//               setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
//             // Send image messages to Firestore
//             setMessages(prevMessages => GiftedChat.append(prevMessages, uploadedMessages));
//             uploadedMessages.forEach(async (message) => {
//                 await addMessageToFirestore(message);
//             });

//             // Update the state with the actual image message

//         } else {
//             setText('');
//             console.log("new message are " , newMessages);
//             // Send text messages only
//             const newMessage = {
//                 _id: Math.random().toString(), // Generate a unique ID
//                 text: newMessages[0]?.text, // No text for image messages
//                 createdAt: new Date(), // Current date and time
//                 user: {
//                     _id: user?.id, // The ID of the current user
//                 },
//             };

//             // Update the state with the actual text message
            
//             // Save the new message to Firestore
//             await addMessageToFirestore(newMessage);
//             // setMessages(prevMessages => GiftedChat.append(prevMessages, [newMessage]));
//         }
//     } catch(err) {
//         console.log(err);
//     } finally {
//         setText('');
//     }
// };

// const uploadImage = async (image, values, ImageName) => {
//     try {
//         setIsUploading(true)
//         const imageIds = [];
//       console.log("the items is ",image)
//       console.log("the images array ",image)
//       for (const imageUri of image) {
//         const formData = new FormData();
//         formData.append("files", {
//           name: `Nijk_IMAGE_ORDER`,
//           type: "image/jpeg",
//           uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
//         });
  
//         try {
//           const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/api/upload`, {
//             method: "POST",
//             body: formData,
//           });
  
//           if (!response.ok) {
//             throw new Error(`Image upload failed with status: ${response.status}`);
//           }
  
//           const responseData = await response.json();
//           const imageId = responseData[0]?.id;
//           imageIds.push(imageId);
//           console.log("the image id :",responseData[0]?.url)
//           return responseData[0]?.url
//         } catch (error) {
//           console.error("Error uploading image:", error);
//           // Handle error gracefully
//         }
//       }
//     //   console.log("the image ids are ",imageIds)
//       dispatch(setCurrentRegisterProperties({ [ImageName]: imageIds }));
  
//       // Return the download URLs instead of dispatching to Redux store
//       const downloadURLs = await Promise.all(imageIds.map(async (id) => {
//         const url = `${EXPO_PUBLIC_BASE_URL}/api/images/${id}`;
//         return url;
//       }));
  
//       return downloadURLs;
//     } catch (error) {
// console.log("error uploadign image ",error)    
// }finally{
//         setIsUploading(false)

//     }
//   };
//  const addMessageToFirestore = async (message) => {
//             const messagesCollection = collection(db, `chatRooms/${CurrentChatRoom[0]?._id}/messages`);
//             await addDoc(messagesCollection, {
//               ...message,
//               createdAt: new Date(),
//             });
//           };


//           // Add this function inside your ChatRoom component
// const handleImageSelected = async (imageUri) => {
//     setIsUploading(true); // Set isUploading to true when the upload starts

//     try {
//       // Upload the image and get the download URL
//       const downloadURL = await uploadImage([imageUri], {}, 'image');
//         // console.log("the download image uri ",downloadURL)
//       // Create a new message object with the image URL
//       const newMessage = {
//         _id: Math.random().toString(), // Generate a unique ID
//         text: null, // No text for image messages
//         createdAt: new Date(), // Current date and time
//         image: downloadURL,
//         user: {
//           _id: user?.id, // The ID of the current user
//         },
//       };
  
//       // Append the new message to the messages array
//       setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
  
//       // Save the new message to Firestore
//       await addMessageToFirestore(newMessage);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }finally {
//         setIsUploading(false); // Set isUploading to false when the upload is complete
//       }
//   };