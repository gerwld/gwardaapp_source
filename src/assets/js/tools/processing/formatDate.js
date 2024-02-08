export default function formatDate(date) {
  // Check if the input is a valid date
  if (!(date instanceof Date && !isNaN(date))) {
    return null; // Return null if the input is not a valid date
  }
  // Get the month, day, and year components from the date object
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  // Construct the formatted date string
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}