

export const dateToString = (date) => {
   return ("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth()+1)).slice(-2);
};

export const fullDateToString = (date) => {
   return dateToString(date) + '.' + date.getFullYear();

};


export const weekdayOf = (date) => {
    const weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    return weekday[date.getDay()];
};

export const openUrl = e => {
    e.preventDefault();
    window.open(e.target.href);
};


{/*character counter*/}
export const countString = (element_name) => {

   var string = document.getElementById(element_name).value

   return string.length


}

