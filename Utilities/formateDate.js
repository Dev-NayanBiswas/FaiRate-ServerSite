const formateDate = ()=>{
    const currentDate = new Date();
    const formatOptions = {
        weekday : 'short',
        day:'2-digit',
        month:'short',
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        hour12:true,
    }

    return currentDate.toLocaleString('en-US', formatOptions);
}

module.exports = formateDate;