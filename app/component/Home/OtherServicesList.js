import React from 'react';
import HeaderTextComponent from './HeaderTextComponent';
import AppCard from './AppCard';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ITEM_DETAILS } from '../../navigation/routes';
import useServices from '../../../utils/services';
import LoadingScreen from '../../screens/loading/LoadingScreen';

export default function OtherServicesList() {
 const { data: services, isLoading } = useServices();
 const navigation = useNavigation();

 if (isLoading) {
    return <LoadingScreen />;
 }

 return (
    <HeaderTextComponent name={'otherServices'}>
      <FlatList
        horizontal
        data={services}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
        }}
        renderItem={({ item }) => (
          <AppCard
            name={item?.attributes?.name}
            price={item?.attributes?.Price}
            onPress={() => navigation.navigate(ITEM_DETAILS, { item })}
            image={item?.attributes?.image?.data?.attributes?.url}
            accessibilityLabel={`View details for ${item?.attributes?.name}`}
          />
        )}
      />
    </HeaderTextComponent>
 );
}
