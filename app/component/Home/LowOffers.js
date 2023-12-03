import React, { useEffect } from 'react'

import HeaderTextComponent from './HeaderTextComponent'
import AppCard from './AppCard'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ITEM_DETAILS } from '../../navigation/routes'
import { useSelector } from 'react-redux'
import useServices from '../../../utils/services'
import LoadingScreen from '../../screens/loading/LoadingScreen'

export default function LowOffers() {
  const navigation = useNavigation()
  const { data :services,isLoading} = useServices()
 
  if(isLoading){
    return <LoadingScreen/>
  }
  return (
    <HeaderTextComponent name={'Low Offers'}  showAll={true}  >
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
