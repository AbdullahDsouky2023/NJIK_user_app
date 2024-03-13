import * as Crypto from 'expo-crypto';
// Correctly import CryptoJS
import axios  from 'axios';
// import FormData from 'form-data';
async function generateHash(orderDetails, merchantPass) {
    const { orderId, amount, currency, description } = orderDetails;
    const toHash = `${orderId}${amount}${currency}${description}${merchantPass}`;
   
    // First, generate an MD5 hash using a custom function since expo-crypto does not directly support MD5
    const md5Hash = await Crypto.digestStringAsync(
       Crypto.CryptoDigestAlgorithm.MD5,
       toHash.toUpperCase()
    );
   
    // Then, generate a SHA1 hash of the MD5 hash
    const sha1Hash = await Crypto.digestStringAsync(
       Crypto.CryptoDigestAlgorithm.SHA1,
       md5Hash
    );
   console.log("chat ",sha1Hash === "9586e838d8f15c29d88c7cfcce03ca4ceed705fd")
    return sha1Hash;
   }
async function initiatePayment(orderDetails, merchantPass) {
 const paymentUrl = 'https://api.edfapay.com/payment/initiate';
 const formData = new FormData();

 formData.append('action', 'SALE');
 formData.append('edfa_merchant_id', '7b613448-c297-4a9e-b996-cb210f5461ab'); // Replace with your actual merchant ID
 formData.append('order_id', orderDetails.orderId);
 formData.append('order_amount', orderDetails.amount);
 formData.append('order_currency', orderDetails.currency);
 formData.append('order_description', orderDetails.description);
 formData.append('payer_first_name', orderDetails.payerFirstName);
 formData.append('payer_last_name', orderDetails.payerLastName);
 formData.append('payer_address', orderDetails.payerAddress);
 formData.append('payer_country', orderDetails.payerCountry);
 formData.append('payer_city', orderDetails.payerCity);
 formData.append('payer_zip', orderDetails.payerZip);
 formData.append('payer_email', orderDetails.payerEmail);
 formData.append('payer_phone', orderDetails.payerPhone);
 formData.append('payer_ip', orderDetails.payerIp);
 formData.append('term_url_3ds', 'https://successorfailurl.com'); // Replace with your actual term URL
 formData.append('auth', 'N');
 formData.append('recurring_init', 'N');

 // Generate the hash
 const hash = await generateHash(orderDetails, merchantPass);
 formData.append('hash', hash);

 const config = {
    method: 'post',
    url: paymentUrl,
    headers: {
        'Content-Type': 'multipart/form-data', // Set the appropriate content type
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    },
    data: formData,
    maxBodyLength: Infinity,
 };

 try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
 } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
 }
}

 export default initiatePayment
// Example usage
const orderDetails = {
 orderId: 'ORD001',
 amount: '1.00',
 currency: 'SAR',
 description: 'An order',
 payerFirstName: 'John',
 payerLastName: 'Doe',
 payerAddress: '123 Main St',
 payerCountry: 'SA',
 payerCity: 'Riyadh',
 payerZip: '12345',
 payerEmail: 'john.doe@example.com',
 payerPhone: '1234567890',
 payerIp: '192.168.1.1'
};


