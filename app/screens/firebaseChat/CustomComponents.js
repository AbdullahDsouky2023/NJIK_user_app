import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { GiftedChat, Bubble, MessageText,InputToolbar } from 'react-native-gifted-chat';
import { Colors } from '../../constant/styles';
import { TextInput, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const { height , width } = Dimensions.get('screen')
export const CustomBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#128C7E"// Change the background color for messages from the left
          },
          right: {
            backgroundColor: Colors.grayColor, // Change the background color for messages from the right
          },
        }}
        textStyle={{
          left: {
            color: Colors.whiteColor // Change the text color for messages from the left
          },
          right: {
            color: Colors.blackColor // Change the text color for messages from the left
          },
        }}
      />
    );
  };
  

  export const renderMessageImage = ({ currentMessage }) => (
    <TouchableOpacity >
      <Image source={{ uri: currentMessage.image }} style={styles.image} />
    </TouchableOpacity>
  );
export   const CustomMessageText = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: {
            color:Colors.whiteColor, // Change the text color for messages from the left
          },
          right: {
            color: Colors.blackColor, // Ce text color for messages from the right
          },
        }}
      />
    );
  };


export const CustomInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputToolbarPrimary}
      secondaryStyle={styles.inputToolbarSecondary}
      
    //   renderSend={(props) => <CustomSend {...props} />}
      renderComposer={(props) => <CustomComposer  {...props} />}
    //   renderActions={}
    />
  );
};

export const CustomComposer = (props) => {
    const { t} = useTranslation()

  return (
    <TextInput
      {...props}
      placeholder={t("Type a message")}
      placeholderTextColor='#999'
      style={styles.composer}
      multiline={true}
      numberOfLines={4}
      
      onChangeText={(val) => {
        props.setText(val);
        console.log("text new " ,val);
      }}
    value={props.text}
    />
  );
};

export const CustomSend = (props) => {
    const { t} = useTranslation()

  return (
    <View style={styles.sendContainer}>
      <Button
        {...props}
        textColor={Colors.whiteColor}
        // placeholderTextColor={Colors.whiteColor}
        style={styles.send}
      >
    <Ionicons name="send" size={24} color="white" />

     
     </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  inputToolbarContainer: {
    backgroundColor: Colors.whiteColor,
    padding:  10,
     paddingVertical:20,
  },
  inputToolbarPrimary: {
    flex:  1,
  },
  inputToolbarSecondary: {
    flex:  0,
  },
  composer: {
    height:  40,
    borderColor: '#ccc',
    borderWidth:  1,
    borderRadius:  15,
    width:width*0.85,
    paddingLeft:  10,
    padding:10,
    writingDirection:'rtl',
    textAlign:'right',
    minHeight:height*0.05,
    maxHeight:height*0.09,
    // height:"auto"
    // tintColor:Colors.primaryColor
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5
  },
  send: {
    color: Colors.whiteColor,
    fontSize:  18,
    fontWeight: '600',
    
    backgroundColor:Colors.primaryColor,
    
    padding:2,
    paddingHorizontal:6,
    borderRadius:15
  },
});