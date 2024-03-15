import axios from 'axios';

const checkPaymentStatus = async (orderId, merchantId, paymentId, hash) => {
 const url = 'https://api.edfapay.com/payment/status';
 const data = {
    order_id: orderId,
    merchant_id: merchantId,
    gway_Payment_id: paymentId,
    hash: hash,
 };

 try {
    const response = await axios.post(url, data);
    return response.data;
 } catch (error) {
    console.error(error);
    return null;
 }
};
const processRefund = async (gwayId, orderId, merchantId, hash, payerIp, amount) => {
    const url = 'https://api.edfapay.com/payment/refund';
    const data = {
       gwayId: gwayId,
       order_id: orderId,
       edfa_merchant_id: merchantId,
       hash: hash,
       payer_ip: payerIp,
       amount: amount,
    };
   
    try {
       const response = await axios.post(url, data);
       return response.data;
    } catch (error) {
       console.error(error);
       return null;
    }
   };
   