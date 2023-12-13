import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../../constant/styles";
import GeneralSettings from "../../component/Account/GeneralSettings";
import Logo from "../../component/Logo";
import AppText from "../../component/AppText";
import { useSelector } from "react-redux";
import { getUserById } from "../../../utils/user";

const { width } = Dimensions.get('screen')

const AccountScreen = ({ navigation }) => {
  const userData = useSelector((state)=>state?.user?.userData)
  const [imageUri,setImageUrl]=useState('https://th.bing.com/th/id/R.e94860c29ac0062dfe773f10b3ce45bf?rik=SCqlsHg1S8oFDA&pid=ImgRaw&r=0')
  useEffect(()=>{
    
    getUserData()

  },[])
  const getUserData = async() =>{
    const userImage = await AsyncStorage.getItem('userImage');
  

    setImageUrl(JSON.parse(userImage))
      const data = await getUserById(userData?.id)
      if(data.image?.url !==JSON.parse(userImage)){
        await AsyncStorage.setItem("userImage", JSON.stringify(data?.image?.url));
        setImageUrl(data.image?.url)
      }
    
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        <View>

        <View style={styles.ImageContainer}>
          <Image source={{uri:imageUri}}
          style={styles.image}
          />
        </View>
          <AppText text={userData?.username} style={{color:Colors.blackColor}}/>
        </View>
        {/* <Logo /> */}
        <GeneralSettings/>
      </View>
    </SafeAreaView>
  );
};


export default AccountScreen;

const styles = StyleSheet.create({
  ImageContainer:{
    paddingHorizontal:width*0.4,
    // backgroundColor:'red',
    paddingVertical:width*0.05,
    marginTop:50
  },
  image :{
    height:70,
    width:70,
    margin:'auto',
    borderRadius:35,
  }
  
})