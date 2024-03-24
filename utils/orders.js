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
    console.log("Error:", error.message,values); // Log the error response
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
export const GetOrderData = async (id) => {
  try {
    const data = await api.get(`/api/orders/${id}?populate=*`);
    if ( data?.data?.data?.id) return data?.data?.data
    return null;
  } catch (error) {
    console.error("Error geting data order   :", error.message); // Log the error response
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
  console.log("refetchig again")

  const fetchOrders = async () => {
    try {
      let allOrders = [];
      let page =  1; // Start with the first page
   console.log("refetchig again")
      while (true) {
        const response = await api.get(`/api/orders?populate=deep,4&pagination[page]=${parseInt(page,  10)}`);
   
        const currentPageOrders = response?.data?.data || [];
        const filteredOrders = currentPageOrders.filter(order => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.status !== "canceled");
        allOrders = [...allOrders, ...filteredOrders];
   
        // Corrected pagination check
        const totalPages = response?.data?.meta?.pagination?.pageCount;
        if (!totalPages || page >= totalPages) {
          break; // No more pages, exit the loop
        }
   
        page++;
      }
   
      return {
        data: allOrders
      };
    } catch (error) {
      console.log("Error fetching orders:", error);
      throw error;
    }
  };
   
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["order"],
    queryFn: fetchOrders,
  });

  return {
    data,
    isLoading,
    isError,
    refetch
  };
}


export function useAllOrders() {
  const user = useSelector((state) => state?.user?.user);
  console.log("refetchig again2")

  const fetchOrders = async () => {
    try {
      let allOrders = [];
      let page =   1; // Start with the first page
      console.log("refetchig again")

      while (true) {
        const response = await api.get(`/api/orders?populate=deep,4&pagination[page]=${parseInt(page,   10)}`);
   
        const currentPageOrders = response?.data?.data || [];
        const filteredOrders = currentPageOrders.filter(order => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.status !== "canceled");
        allOrders = [...allOrders, ...filteredOrders];
   
        // Corrected pagination check
        const totalPages = response?.data?.meta?.pagination?.pageCount;
        if (!totalPages || page >= totalPages) {
          break; // No more pages, exit the loop
        }
   
        page++;
      }
   
      return {
        data: allOrders
      };
    } catch (error) {
      console.log("Error fetching orders:", error);
      throw error;
    }
  };
   
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-orders"],
    queryFn: fetchOrders,
  });

  return {
    data,
    isLoading,
    isError,
    refetch
  };
}
