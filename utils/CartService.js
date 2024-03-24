import { useQuery } from "@tanstack/react-query";
// import api from './index';

import api from './index'
import { useSelector } from "react-redux";



export default function useCartServices() {
  const fetchOrders = async () => {
    try {
      let allCartServices = [];
      let page =  1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/service-carts?populate=deep&pagination[page]=${parseInt(page,  10)}`);
  
        // Assuming response.data is an array, proceed with adding to the allCartServices array
        const currentPageCartServices = response?.data?.data || [];
        allCartServices = [...allCartServices, ...currentPageCartServices];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allCartServices;
    } catch (error) {
      console.log("Error fetching cart-services:", error);
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
}export  function useAllOrders() {
  const user = useSelector((state) => state?.user?.user);
  console.log("retching cardhio22")

  const fetchOrders = async () => {
    try {
      let allOrders = [];
      let page = 1; // Start with the first page
  console.log("retching cardhio22")
      while (true) {
        const response = await api.get(`/api/orders?populate=deep,4&pagination[page]=${parseInt(page, 10)}`);
  
        // Assuming response.data is an array, proceed with filtering
        const currentPageOrders = response?.data?.data || [];
        const filteredOrders = currentPageOrders.filter(order => order?.attributes?.phoneNumber === user?.phoneNumber);
        allOrders = [...allOrders, ...filteredOrders];
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allOrders;
    } catch (error) {
      console.log("Error fetching orders:", error);
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
