import React from 'react';
import { View, Button } from 'react-native';
import * as Localization from 'react-native-localize';
import i18n from './i18n'; // Import your i18n configuration
import { changeLanguage } from '../../../utils/language';
import AppButton from '../AppButton';

const LanguageSwitcher = () => {


  return (
    <View>
      <AppButton title="English" onPress={() => changeLanguage('en')} />
      <AppButton title="Arabic" onPress={() => changeLanguage('ar')} />
      {/* Add more buttons for other languages */}
    </View>
  );
};

export default LanguageSwitcher;
