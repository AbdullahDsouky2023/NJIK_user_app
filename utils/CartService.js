import { useQuery } from "@tanstack/react-query";
// import api from './index';

import api from './index'



export default function useCartServices() {
  const fetchOrders = async () => {
    try {
      const response = await api.get(`/api/service-carts?populate=deep
      `);

      return response.data;
    } catch (error) {
      console.error("Error fetching cart-services:", error);
      throw error;
    }
  };

  const { data, isLoading, isError ,refetch} = useQuery({
    queryKey: ["cart-services"],
    queryFn: fetchOrders,
  
  }); // Changed the query key to 'superheroes'

  return {
    data,
    isLoading,
    isError,
    refetch
  };
}
export  function useAllOrders() {
  const fetchOrders = async () => {
    try {
      const response = await api.get(`/api/orders?populate=*
      `);

      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };

  const { data, isLoading, isError ,refetch} = useQuery({
    queryKey: ["order"],
    queryFn: fetchOrders,
  
  }); // Changed the query key to 'superheroes'

  return {
    data,
    isLoading,
    isError,
    refetch
  };
}
