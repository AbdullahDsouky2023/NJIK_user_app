import { useQuery } from '@tanstack/react-query';
import api from './index'



export default function usePackages() {
  const fetchPackages = async () => {
    try {
      let allPackages = [];
      let page =   1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/packages?populate=deep&pagination[page]=${parseInt(page,   10)}`);
  
        // Assuming response.data is an array, proceed with adding to the allPackages array
        const currentPagePackages = response?.data?.data || [];
        allPackages = [...allPackages, ...currentPagePackages];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allPackages;
    } catch (error) {
      console.log("Error fetching packages:", error);
      throw error;
    }
  };
  
  const { data , isLoading,isError } = useQuery(
    { queryKey: ["Packages"], queryFn: fetchPackages }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


