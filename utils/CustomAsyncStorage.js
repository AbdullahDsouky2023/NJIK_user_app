import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';

class CustomAsyncStorage extends EventEmitter {
 static EVENT_CHANGE = 'change';

 static async getItem(key) {
   const value = await AsyncStorage.getItem(key);
   this.emit(this.EVENT_CHANGE, { key, value });
   return value;
 }

 static async setItem(key, value) {
   await AsyncStorage.setItem(key, value);
   this.emit(this.EVENT_CHANGE, { key, value });
 }

 // Add other AsyncStorage methods as needed
}

export default CustomAsyncStorage;
