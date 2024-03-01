import { useQuery } from '@tanstack/react-query';
import api from './index'



export default function useServices() {
  const fetchServices = async () => {
    try {
      let allServices = [];
      let page =   1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/services?populate=*&pagination[page]=${parseInt(page,   10)}`);
  
        // Assuming response.data is an array, proceed with adding to the allServices array
        const currentPageServices = response?.data?.data || [];
        allServices = [...allServices, ...currentPageServices];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allServices;
    } catch (error) {
      console.log("Error fetching services:", error);
      throw error;
    }
  };
  

  const { data , isLoading,isError } = useQuery(
    { queryKey: ["services"], queryFn: fetchServices }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


