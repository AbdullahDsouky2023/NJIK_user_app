import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Define a custom hook that takes a key and an initial value
export const useAsyncStorage = (key, initialValue) => {
    // Use useState to store the current value
    const [storedValue, setStoredValue] = useState(initialValue);
  
    // Use useEffect to fetch the initial value from AsyncStorage
    useEffect(() => {
      const getStoredValue = async () => {
        try {
          // Get the value from AsyncStorage
          const value = await AsyncStorage.getItem(key);
          // Parse the value if it is a JSON string
          const parsedValue = value ? JSON.parse(value) : null;
          // Update the state with the value
          setStoredValue(parsedValue);
        } catch (error) {
          // Handle any errors
          console.error(error);
        }
      };
      // Call the function
      getStoredValue();
    }, [key]); // Only run once when the key changes
  
    // Define a setter function that updates both the state and the AsyncStorage
    const setValue = async (value) => {
      try {
        // Update the state with the value
        setStoredValue(value);
        // Stringify the value if it is an object
        const stringValue = typeof value === "object" ? JSON.stringify(value) : value;
        // Set the value in AsyncStorage
        await AsyncStorage.setItem(key, stringValue);
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };
  
    // Return the current value and the setter function
    return [storedValue, setValue];
  };
  
  // Use the custom hook in your AccountScreen component
 
  