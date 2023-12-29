import { useQuery } from '@tanstack/react-query';
import api from './index'
import { useSelector }  from 'react-redux'

export function useUserCoupons() {

    const userData = useSelector((state) => state?.user?.userData);

const fetchUserCoupons = async () => {
    try {
      const response = await api.get(`/api/users/${userData?.id}?populate=*`);
     
 
      return response?.data
    } catch (error) {
      console.error("Error fetching UserCoupons:", error);
      throw error;
    }
  };
  const { data, isLoading,isError } = useQuery(
    { queryKey: ["usdedCoupons"], queryFn: fetchUserCoupons }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}
  // Test the function with some sample data
  

 export default function useCoupons() {
  const fetchCoupons = async () => {
    try {
      const response = await api.get(`/api/coupons?populate=deep`);
      let validCoupons = [];
      // Get the current date
      let today = new Date();
      // Loop through each coupon in the input array
      for (let coupon of response.data.data) {
        // Get the expiration date of the coupon
        let expirationDate = new Date(coupon.attributes.expirationDate);
        // Check if the expiration date is later than or equal to the current date
        if (expirationDate >= today) {
            // If yes, push the coupon to the valid coupons array
            validCoupons.push(coupon);
          }
      }
      // Return the valid coupons array
      return validCoupons;
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      throw error;
    }
  };

  const { data, isLoading,isError } = useQuery(
    { queryKey: ["Coupons"], queryFn: fetchCoupons }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


