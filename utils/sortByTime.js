const sortByDate = (a,b) => {  
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
};

export default sortByDate;