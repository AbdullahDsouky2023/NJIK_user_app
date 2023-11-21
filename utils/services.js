import { useQuery } from '@tanstack/react-query';
import api from './index'



export default function useServices() {
  const fetchCategories = async () => {
    try {
      const response = await api.get(`/api/services?populate=*`);
      
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const { data , isLoading,isError } = useQuery(
    { queryKey: ["services"], queryFn: fetchCategories }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


