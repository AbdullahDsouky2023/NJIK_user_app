import { useQuery } from "@tanstack/react-query";
// import api from './index';

import api from './index'
import { useSelector } from "react-redux";



export default function usePaymentProcess() {
  const fetchPaymentProcess = async () => {
    try {
      let allPaymentProcesses = [];
      let page =  1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/payment-processes?populate=deep&pagination[page]=${parseInt(page,  10)}`);
  
        // Assuming response.data is an array, proceed with adding to the allPaymentProcesses array
        const currentPagePaymentProcess = response?.data?.data || [];
        console.log("the payment process",currentPagePaymentProcess)
        allPaymentProcesses = [...allPaymentProcesses, ...currentPagePaymentProcess];
  
        // Check if there is a next page in the pagination information
        const nextPage = response?.data?.meta?.pagination.pageCount;
        if (nextPage === page) {
          break; // No more pages, exit the loop
        }
  
        // Move to the next page
        page++;
      }
  
      return allPaymentProcesses;
    } catch (error) {
      console.log("Error fetching payment process", error);
      throw error;
    }
  };
  

  const { data, isLoading, isError ,refetch} = useQuery({
    queryKey: ["payment process fetching "],
    queryFn: fetchPaymentProcess,
  
  }); 

  return {
    data,
    isLoading,
    isError,
    refetch
  };
}

export const AddNewPaymentProcess = async (data) => {
    try {
      const res = await api.post("/api/payment-processes", {
        data: {
          ...data
        },
      });
  
      return res?.data?.data?.id ? res?.data?.data?.id : null;
    } catch (error) {
      console.log("Error:", error.message,values); // Log the error response
    }
  };