import { useQuery } from '@tanstack/react-query';
import api from './index'



export default function usePackages() {
  const fetchPackages = async () => {
    try {
      const response = await api.get(`/api/packages?populate=deep`);
      
      return response.data
    } catch (error) {
      console.error("Error fetching Packages:", error);
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


