/**
 * Formats a numeric price into a Rupee (INR) currency string.
 * @param {number} price - The price to format.
 * @returns {string} - Formatted currency string (e.g., ₹10,000).
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};
