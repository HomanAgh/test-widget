export const formatSavePercentage = (savePercentage: number | undefined): string => {
  if (savePercentage === undefined) return '.000';
  
  // Convert to string
  let svpString = savePercentage.toString();
  
  // If the value is 1 (perfect save percentage)
  if (savePercentage === 1) {
    return '1.000';
  }
  
  // If the value already contains a decimal point, we need to handle it differently
  if (svpString.includes('.')) {
    // Remove the decimal and ensure 3 digits
    svpString = svpString.replace('.', '');
    // Pad with zeros at the end if needed
    while (svpString.length < 3) {
      svpString += '0';
    }
    // If more than 3 digits, truncate to 3
    if (svpString.length > 3) {
      svpString = svpString.substring(0, 3);
    }
  } else {
    // For whole numbers, add three zeros
    svpString += '000';
    // If more than 3 digits, truncate to 3
    if (svpString.length > 3) {
      svpString = svpString.substring(0, 3);
    }
  }
  
  // Special case: if the formatted string would be '.100', return '1.000' instead
  if (svpString === '100') {
    return '1.000 (SO)';
  }
  
  // Insert decimal point at the beginning
  return '.' + svpString;
}; 