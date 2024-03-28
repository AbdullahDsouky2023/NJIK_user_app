import * as Location from 'expo-location';
import UseLocation from '../../../utils/useLocation';

export function CalculateTax(orderPrice) {
    // Calculate the tax amount
    const taxAmount = orderPrice * 0.15; // 15% of the order price

    // Return the total price
    return taxAmount.toFixed(2);
}
export function calculateTotalWithTax(orderPrice) {
    // Calculate the tax amount
    const taxAmount = orderPrice * 0.15; // 15% of the order price

    // Calculate the total price including the tax
    const totalPrice = orderPrice + taxAmount;

    // Return the total price
    return totalPrice;
}
export async function getZipCode() {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
       Alert.alert('Permission to access location was denied');
       throw new Error('Permission to access location was denied');
    }
   
    // Get the current location
    let location = await Location.getCurrentPositionAsync({});
   
    // Get the zip code
    let addresses = await Location.reverseGeocodeAsync(location.coords);
    if (addresses && addresses.length > 0) {
       let zipCode = addresses[0].postalCode;
       return zipCode;
    }
    return null;
   }

   
// Example usage
// caalue the coupon amount 
export const CalculatePriceWithCoupon = (orderAmount, CouponValue) => {
    const discountPercentage = Number(CouponValue) / 100;
    const discountAmount = Number(orderAmount * discountPercentage).toFixed(2);
    const totalPrice = Number(orderAmount - discountAmount).toFixed(2);
    return {
        totalPrice,
        discountAmount,
        discountPercentage
    };
}
/**
 * Calculates the original price based on the discount amount.
 * @param {number} currentPrice - The current price.
 * @param {number} discountAmount - The discount amount (percentage).
 * @returns {Object} An object containing the original price and discount percentage.
 */
export const CalculatePriceWithoutCoupon = (currentPrice, discountAmount) => {
    console.log("Current price:", currentPrice, "Discount amount:", discountAmount);

    if (!discountAmount || discountAmount <= 0 || discountAmount >= 100) {
        // No discount or invalid discount amount
        return {
            originalPrice: currentPrice || "يتم الحساب",
            discountPercentage: 0,
        };
    }

    // Calculate the discount percentage
    const discountPercentage = discountAmount / 100;

    // Calculate the original price
    const originalPrice = Number(currentPrice / (1 - discountPercentage)).toFixed(2);

    return {
        originalPrice: originalPrice,
        discountPercentage: discountAmount,
    };
};

// Example usage:
const currentPrice = 100; // Example current price
const discountAmount = 20; // Example discount amount (percentage)
const result = CalculatePriceWithoutCoupon(currentPrice, discountAmount);
console.log("Original price:", result.originalPrice);
console.log("Discount percentage:", result.discountPercentage);

//1250 be 1000 without addional
 export const CalculteServicePriceWithoutAddionalPrices = (item)=>{
    let PurePrice = 0
    const addionalPrices = item?.attributes?.additional_prices?.data
    const  totalPrice = item?.attributes?.totalPrice
    const providerFee = item?.attributes?.provider_fee
    if(addionalPrices?.length > 0){

        PurePrice = addionalPrices.reduce((accumulator, currentItem) => {
            return accumulator + currentItem?.attributes?.Price;
        }, 0);
    }
    if(providerFee > 0 ){
        return totalPrice

    }
    console.log("pure",PurePrice,totalPrice,totalPrice - PurePrice)
    return totalPrice - PurePrice
}
//return how much will be discounted from
export const getValueDiscountFromBalance = (balance, orderAmount) => {
    console.log("***********balance is ",balance,orderAmount)
    let amountToPayWithWallet = 0;
    let amountToPayInCash = 0;

    // If the balance is greater than or equal to the order amount,
    // use the balance to pay for the order.
    if (balance >= orderAmount) {
        amountToPayWithWallet = orderAmount;
        amountToPayInCash = 0; // No cash payment needed
    } else {
        // If the balance is less than the order amount,
        // calculate the remaining amount to be paid in cash.
        amountToPayWithWallet = balance;
        amountToPayInCash = orderAmount - balance;
    }

    return {
        amountToPayWithWallet:Number(amountToPayWithWallet)?.toFixed(2),
        amountToPayInCash:Number(amountToPayInCash)?.toFixed(2)
    };
}



/**
 * Calculates the provider's profit after payment.
 * @param {Object} orderData - The order data containing necessary attributes.
 * @returns {number} The provider's profit.
 */
export const calculateProviderProfitAfterPayment = (orderData) => {
    try {
        // Extract necessary data from orderData
        const totalPrice = orderData?.attributes?.totalPrice || 0;
        const providerFee = orderData?.attributes?.provider_fee || 0;
        const coupons = orderData?.attributes?.coupons?.data || [];

        // Calculate the base price after applying coupons
        let basePrice = totalPrice;
      
        // Calculate the provider's profit
        let providerProfit = 0;
        if (providerFee > 0) {
            const additionalPriceAmount = orderData?.attributes?.additional_prices?.data?.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem?.attributes?.Price;
                }, 0);
            
            if(additionalPriceAmount > 0){
                providerProfit+=additionalPriceAmount
            }
            console.log("the provider provider",providerProfit,additionalPriceAmount)
            providerProfit +=  providerFee;
        } else {
            const totalServicePrice = CalculteServicePriceWithoutAddionalPrices(orderData) || 0;
            const additionalPriceAmount = basePrice - totalServicePrice;

            // Ensure the additional price amount is non-negative
            const adjustedAdditionalPrice = Math.max(additionalPriceAmount, 0);

            // Calculate the provider's profit based on total service price and additional prices
            const baseProfit = totalServicePrice * 0.80;
            providerProfit = baseProfit + adjustedAdditionalPrice;
        }

        return providerProfit;
    } catch (error) {
        console.error("Error calculating provider profit:", error);
        return 0; // Return a default value or handle the error appropriately
    }
};




