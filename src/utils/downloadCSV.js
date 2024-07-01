export const downloadCSV = (expenses) => {
    let transactions = expenses; 
  
    
    function convertToCSV(objArray) {
      const array = objArray;
      let str = '';
      const headersOrder = ['date', 'time', 'amount', 'description'];
      
   
      str += headersOrder.join(',') + '\n';
      
    
      for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let header of headersOrder) {
          if (line !== '') line += ',';
          
        
          if (header === 'date' || header === 'time') {
            let dateTime = array[i]['date'];
            if (header === 'date') {
              line += dateTime.split(', ')[0];
            } else if (header === 'time') {
              line += dateTime.split(', ')[1];
            }
          } else {
            line += array[i][header] !== undefined ? array[i][header] : ''; 
          }
        }
        str += line + '\n';
      }
      return str;
    }
  
    let csvData = convertToCSV(transactions);
  
    // Function to trigger CSV file download
    function downloadCSV(csv, filename) {
      const csvFile = new Blob([csv], { type: 'text/csv' });
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  
    downloadCSV(csvData, 'transactions.csv');
  };
  