import { useQuery } from "@tanstack/react-query";
// import api from './index';

import api from './index'
import { useSelector } from "react-redux";

export const postOrder = async (values) => {
  try {
    const res = await api.post("/api/orders", {
      data: {
        ...values,
        status:"pending"
      },
    });
    return res?.data?.data?.id ? res?.data?.data?.id : null;
  } catch (error) {
    console.error("Error:", error.message); // Log the error response
  }
};

export const cancleOrder = async (id) => {
  try {
    const data = await api.delete(`/api/orders/${id}`);
    if (data?.data?.data?.id) return data?.data?.data?.id;
    return false;
  } catch (error) {
    console.error("Error deleting the item :", error.message); // Log the error response
  }
};
export const PayOrderForReserve = async (id) => {
  try {
    const data = await api.put(`/api/orders/${id}`,{
      data:{
        PaymentStatus:"payed",
        
      }
    });
    if ( data?.data?.data?.id) return true
    return false;
  } catch (error) {
    console.error("Error accepting order   :", error.message); // Log the error response
  }
};
export const updateOrderData = async (id,orderData) => {
  try {
    const data = await api.put(`/api/orders/${id}`,{
      data:{
       ...orderData
        
      }
    });
    if ( data?.data?.data?.id) return true
    return false;
  } catch (error) {
    console.error("Error updatingorder order   :", error.message); // Log the error response
  }
};
export const handleDelayOrder = async (id,values) => {
  try {
    const data = await api.put(`/api/delay-requests/${id}`, {
      data: {
        ...values,
      },
    });
    console.log("res delay data",data?.data?.data?.id)
    return data?.data?.data || null
  } catch (error) {
    console.error("Error 22:", error.message); // Log the error response
  }
};

export const PayOrder = async (id) => {
  try {
    const data = await api.put(`/api/orders/${id}`,{
      data:{
        PaymentStatus:"payed",
        status:'payed',
        provider_payment_status:"payed",
        addtional_prices_state:"accepted"


      }
    });
    if ( data?.data?.data?.id) return true
    return false;
  } catch (error) {
    console.error("Error accepting order   :", error.message); // Log the error response
  }
};
export const CreateCartService = async (cartItem) => {
  try {
    const data = await api.post(`api/service-carts`,{
      data:{
      ...cartItem

      }
    });
    if ( data?.data?.data?.id) return data?.data?.data?.id
    return false;
  } catch (error) {
    console.error("Error creating the service item   :", error.message); // Log the error response
  }
};
export const AddOrderReview = async (id,review) => {
  try {
    const data = await api.put(`/api/orders/${id}`,{
      data:{
        userOrderRating:review.rating ,
       userOrderReview:review.content,
       status:"finished"
      }
    });
    if ( data?.data?.data?.id) return true
    return false;
  } catch (error) {
    console.error("Error accepting order   :", error.message); // Log the error response
  }
};
export const AddOrderComplain = async (id,ComplainId) => {
  try {
    const data = await api.put(`/api/orders/${id}`,{
      data:{
        complain:{
connect:[{id:ComplainId}]
        }
      }
    });
    if ( data?.data?.data?.id) return true
    return false;
  } catch (error) {
    console.error("Error accepting order   :", error.message); // Log the error response
  }
};
export default function useOrders() {
  const user = useSelector((state) => state?.user?.user);

  const fetchOrders = async () => {
    try {
      let allOrders = [];
      let page = 1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/orders?populate=deep,4&pagination[page]=${parseInt(page, 10)}`);
        console.log("Response data:", response?.data?.data?.length); // Log the response data
  
        // Assuming response.data is an array, proceed with filtering
        const currentPageOrders = response?.data?.data || [];
        const filteredOrders = currentPageOrders.filter(order => order?.attributes?.phoneNumber === user?.phoneNumber);
        allOrders = [...allOrders, ...filteredOrders];
        console.log("pageingation data", response?.data?.meta?.pagination.pageCount,page)
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
export  function useAllOrders() {
  const user = useSelector((state) => state?.user?.user);

  const fetchOrders = async () => {
    try {
      let allOrders = [];
      let page = 1; // Start with the first page
  
      while (true) {
        const response = await api.get(`/api/orders?populate=deep,4&pagination[page]=${parseInt(page, 10)}`);
        console.log("Response data:", response?.data?.data?.length); // Log the response data
  
        // Assuming response.data is an array, proceed with filtering
        const currentPageOrders = response?.data?.data || [];
        const filteredOrders = currentPageOrders.filter(order => order?.attributes?.phoneNumber === user?.phoneNumber);
        allOrders = [...allOrders, ...filteredOrders];
        console.log("pageingation data", response?.data?.meta?.pagination.pageCount,page)
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
