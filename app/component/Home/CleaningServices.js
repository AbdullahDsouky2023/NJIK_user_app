import {  FlatList } from 'react-native'
import React from 'react'
import HeaderTextComponent from './HeaderTextComponent'
import AppBigCard from './AppBigCard'
import { LowOffersList, ReadyPackages } from '../../data/home'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { ITEM_DETAILS } from '../../navigation/routes'
import useServices from '../../../utils/services'

export default function CleaningServices() {
  const { data :services,isLoading} = useServices()
 
  if(isLoading){
    return <LoadingScreen/>
  }  const navigation = useNavigation()
  return (
    <HeaderTextComponent name={'homeCleaningServices'}  showAll={true}>
        <FlatList
        horizontal
        data={services?.data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item,index) => item.id}

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