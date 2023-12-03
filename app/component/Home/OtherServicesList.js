import React from 'react'

import HeaderTextComponent from './HeaderTextComponent'
import AppCard from './AppCard'
import { FlatList } from 'react-native'
import { LowOffersList } from '../../data/home'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ITEM_DETAILS } from '../../navigation/routes'
import useServices from '../../../utils/services'

export default function OtherServicesList() {
  const { data :services,isLoading} = useServices()
 
  if(isLoading){
    return <LoadingScreen/>
  }  const navigation = useNavigation()

  return (
    <HeaderTextComponent name={'otherServices'} >
        <FlatList
        horizontal
        data={services?.data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item,index)=>item.id}

        style={{
            display:'flex',
            flexDirection:'row',
            gap:15
        }}
        renderItem={({item})=>(
          <AppCard
          name={item?.attributes?.name}
          price={item?.attributes?.Price}
          onPress={()=>navigation.navigate(ITEM_DETAILS,{item})}
          image={item?.attributes?.image?.data?.attributes?.url}
          />

        )}
        />
    </HeaderTextComponent>
  )
}
