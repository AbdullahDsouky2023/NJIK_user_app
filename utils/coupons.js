import { useQuery } from '@tanstack/react-query';
import api from './index'
import { useSelector }  from 'react-redux'

export function useUserCoupons() {

    const userData = useSelector((state) => state?.user?.userData);

    const fetchUserCoupons = async () => {
      try {
        let allUserCoupons = [];
        let page =   1; // Start with the first page
    
        while (true) {
          const response = await api.get(`/api/users/${userData?.id}?populate=*&pagination[page]=${parseInt(page,   10)}`);
          console.log("coupons data:", response?.data?.data?.length); // Log the response data
    
          // Assuming response.data is an array, proceed with adding to the allUserCoupons array
          const currentPageCoupons = response?.data || [];
          allUserCoupons = [...allUserCoupons, ...currentPageCoupons];
    
          // Check if there is a next page in the pagination information
          const nextPage = response?.data?.meta?.pagination.pageCount;
          if (nextPage === page) {
            break; // No more pages, exit the loop
          }
    
          // Move to the next page
          page++;
        }
    
        return allUserCoupons;
      } catch (error) {
        console.log("Error fetching UserCoupons:", error);
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
      let page =   1; // Start with the first page
      let today = new Date();
  
      while (true) {
        const response = await api.get(`/api/coupons?populate=deep&pagination[page]=${parseInt(page,   10)}`);
        console.log("Response data:", response?.data?.data?.length); // Log the response data
  
        // Assuming response.data is an array, proceed with adding to the allCoupons array
        const currentPageCoupons = response?.data?.data || [];
        allCoupons = [...allCoupons, ...currentPageCoupons];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      // Filter out expired coupons
      let validCoupons = allCoupons.filter(coupon => {
        let expirationDate = new Date(coupon.attributes.expirationDate);
        return expirationDate >= today;
      });
  
      return validCoupons;
    } catch (error) {
      console.log("Error fetching Coupons:", error);
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


