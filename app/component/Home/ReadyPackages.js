import { View, Text, FlatList } from 'react-native'
import React from 'react'
import HeaderTextComponent from './HeaderTextComponent'
import AppBigCard from './AppBigCard'
import { ReadyPackages as data } from '../../data/home'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ITEM_DETAILS } from '../../navigation/routes'
import useServices from '../../../utils/services'
import LoadingScreen from '../../screens/loading/LoadingScreen'
export default function ReadyPackages() {
  const { data :services,isLoading} = useServices()
  const navigation = useNavigation()
 
  // if(isLoading){
  //   return <LoadingScreen/>
  // }  

  return (
    <HeaderTextComponent name={'Packages'}  showAll={true}>
        <FlatList
        horizontal
        data={services?.data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item,index)=>item.id}
        showsVerticalScrollIndicator={false}

        style={{
            display:'flex',
            flexDirection:'row',
            gap:15
        }}
        renderItem={({item })=>(
            <AppBigCard
            name={item?.attributes?.name}
            price={item?.attributes?.Price}
            onPress={()=>navigation.navigate(ITEM_DETAILS,{item})}
            category={item?.attributes?.category?.data?.attributes?.name}
            image={item?.attributes?.image?.data?.attributes?.url}

            />

        )}
        />
    </HeaderTextComponent>
  )
}