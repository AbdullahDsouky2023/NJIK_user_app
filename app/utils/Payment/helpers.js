export function CalculateTax(orderPrice) {
    // Calculate the tax amount
    const taxAmount = orderPrice * 0.15; // 15% of the order price

    // Return the total price
    return taxAmount;
}
export function calculateTotalWithTax(orderPrice) {
    // Calculate the tax amount
    const taxAmount = orderPrice * 0.15; // 15% of the order price

    // Calculate the total price including the tax
    const totalPrice = orderPrice + taxAmount;

    // Return the total price
    return totalPrice;
}

// Example usage

