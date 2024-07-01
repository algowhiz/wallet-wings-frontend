export const formatAmount = (amount) => {
    let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedAmount = formattedAmount.replace(/\B(?=(\d{4})+(?!\d))/g, ',');
    return formattedAmount;
  };
  