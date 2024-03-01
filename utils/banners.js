import { useQuery } from '@tanstack/react-query';
import api from './index'



 export default function useBanners() {
  const fetchBanners = async () => {
    try {
      let allBanners = [];
      let page =  1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/banners?populate=deep&pagination[page]=${parseInt(page,  10)}`);
  
        // Assuming response.data is an array, proceed with adding to the allBanners array
        const currentPageBanners = response?.data?.data || [];
        allBanners = [...allBanners, ...currentPageBanners];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allBanners;
    } catch (error) {
      console.log("Error fetching banners:", error);
      throw error;
    }
  };
  

  const { data, isLoading,isError } = useQuery(
    { queryKey: ["banners"], queryFn: fetchBanners }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


