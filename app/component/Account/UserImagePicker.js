import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToStrapi } from '../../../utils/UploadToStrapi';

import { Ionicons } from "@expo/vector-icons";

import { useSelector } from 'react-redux'
import { Colors } from '../../constant/styles';
import { getUserById } from '../../../utils/user';
import LoadingScreen from '../loadingScreen';
const { width } = Dimensions.get('screen')
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserImagePicker({setImage,image}) {
 const userData = useSelector((state)=>state?.user?.userData)
 const [imageUri,setImageUrl]=useState('https://th.bing.com/th/id/R.e94860c29ac0062dfe773f10b3ce45bf?rik=SCqlsHg1S8oFDA&pid=ImgRaw&r=0')

 useEffect(()=>{
    getUserData()
  },[])
  const getUserData = async() =>{
    const data = await AsyncStorage.getItem("userImage")
    setImageUrl(JSON.parse(data))
  }

   const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

   if (!result.canceled) {
     setImage(result.assets[0].uri);
   }
 };

 

 return (
   <View style={styles.container}>
    <TouchableOpacity  onPress={pickImage} style={styles.container}>
        <Image source={{ uri:image ||   imageUri  }} 
        style={styles.Image} />
        <View style={styles.Overlay}>
        <Ionicons name="camera" size={24} color="black" />

        </View>
    </TouchableOpacity>
   </View>
 );
}
const styles = StyleSheet.create({
    container :{ flex: 1, alignItems: 'center', justifyContent: 'center',position:"relative" }
,    ImageContainer:{
        height:width*0.3,
        width:width*0.3,
        // marginVertical:100
    },
    Image:{ width: width*0.3,marginVertical: width*0.02,borderRadius:width*0.15,height: width*0.3 },
    Overlay:{
        height:width*0.3,
        width:width*0.3,
        borderRadius:width*0.4,
        backgroundColor:Colors.overlayColor,
        flex: 1, alignItems: 'center', justifyContent: 'center',
        position:'absolute'
    }
})
