export const parseCSV = (text) => {
  // Split the text into lines
  const lines = text.split('\n');

  // Extract the headers
  const headers = lines[0].split(',').map(header => header.trim());

  // Map over each line (excluding the header) to create an object for each line
  const transactions = lines.slice(1).map(line => {
    // Split the line into values
    const values = line.split(',').map(value => value.trim());

    // Create an object for the transaction
    const transaction = {};
    headers.forEach((header, index) => {
      transaction[header] = values[index];
    });

    return transaction;
  });

  // Filter out any invalid transactions (e.g., missing amount or description)
  return transactions.filter(transaction => transaction.date && transaction.amount && transaction.description);
};
