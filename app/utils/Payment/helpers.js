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
    const discountAmount = orderAmount * discountPercentage;
    const totalPrice = orderAmount - discountAmount;
    return {
        totalPrice,
        discountAmount,
        discountPercentage
    };
}

//1250 be 1000 without addional
 export const CalculteServicePriceWithoutAddionalPrices = (item)=>{
    let PurePrice = 0
    const addionalPrices = item?.attributes?.additional_prices?.data
    const  totalPrice = item?.attributes?.totalPrice
    const providerFee = item?.attributes?.providerFee
    if(addionalPrices){

        PurePrice = addionalPrices.reduce((accumulator, currentItem) => {
            return accumulator + currentItem?.attributes?.Price;
        }, 0);
    }
    if(providerFee){
        PurePrice+=providerFee
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
        amountToPayWithWallet:amountToPayWithWallet?.toFixed(2),
        amountToPayInCash:amountToPayInCash?.toFixed(2)
    };
}
