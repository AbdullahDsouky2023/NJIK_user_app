import { useQuery } from '@tanstack/react-query';
import api from './index'



export default function useOffers() {
  const fetchOffers = async () => {
    try {
      const response = await api.get(`/api/offers?populate=*`);
      
      return response.data
    } catch (error) {
      console.error("Error fetching off:", error);
      throw error;
    }
  };

  const { data , isLoading,isError } = useQuery(
    { queryKey: ["Offers"], queryFn: fetchOffers }
  ); // Changed the query key to 'superheroes'
  
  return {
    data,
    isLoading,
    isError
  };
}


