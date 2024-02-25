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
      let allCoupons = [];
      let page =  1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/coupons?populate=deep&pagination[page]=${page}`);
        console.log("Response data:", response?.data?.data?.length);
  
        const currentPageCoupons = response?.data?.data || [];
        let validCoupons = [];
        let today = new Date();
  
        for (let coupon of currentPageCoupons) {
          let expirationDate = new Date(coupon.attributes.expirationDate);
          if (expirationDate >= today) {
            validCoupons.push(coupon);
          }
        }
  
        allCoupons = [...allCoupons, ...validCoupons];
  
        // Check pagination to determine if there are more pages
        const totalPages = response?.data?.meta?.pagination?.pageCount;
        if (!totalPages || page >= totalPages) {
          break; // No more pages, exit the loop
        }
  
        page++;
      }
  
      return allCoupons;
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

