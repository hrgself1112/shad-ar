// datetime.js


const getCurrentFormattedNumberDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
    const dayOfMonth = currentDate.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${dayOfMonth}`;
  };
  const getCurrentFormattedDate = () => {
    const currentDate = new Date();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "short" });
    const dayOfMonth = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
  
    // Add leading zeros for dayOfMonth if it's less than 10
    const formattedDayOfMonth = dayOfMonth < 10 ? `0${dayOfMonth}` : dayOfMonth;
  
    return `${dayOfWeek}, ${formattedDayOfMonth} ${monthNames[month]} ${year}`;
  
  };
  const getCurrentFormattedTime = () => {
    const currentDate = new Date();
  
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
  
    // Convert hours to 12-hour format
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    return {
      three: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      two: `${formattedHours}:${formattedMinutes}`
    };
  };
  
  
  const getamOrpm = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const amOrPm = hours >= 12 ? "PM" : "AM";
    return `${amOrPm}`;
  };
  
  module.exports = {
    getCurrentFormattedDate,
    getCurrentFormattedTime,
    getamOrpm,
    getCurrentFormattedNumberDate
  };
  