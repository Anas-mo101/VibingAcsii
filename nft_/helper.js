const timeAgo = (d) => {
    const diff = (new Date() - Date.parse(d))/1000;
    if(diff<60){
        const v = Math.round(diff);
        return v + ' second' + (v===1?'':'s') + ' ago';   
    }else if(diff<60*60){
        const v = Math.round(diff/60);
        return v + ' minute' + (v===1?'':'s') + ' ago';   
    }else if(diff<60*60*24){
        const v = Math.round(diff/(60*60));
        return v + ' hour' + (v===1?'':'s') + ' ago';   
    }else if(diff<60*60*24*30.436875){
        const v = Math.round(diff/(60*60*24));
        return v + ' day' + (v===1?'':'s') + ' ago';
    }else if(diff<60*60*24*30.436875*12){
        const v = Math.round(diff/(60*60*24*30.436875));
        return v + ' month' + (v===1?'':'s') + ' ago';
    }
    const v = Math.round(diff/(60*60*24*30.436875*12));
    return v + ' year' + (v===1?'':'s') + ' ago';
}


module.exports = {
    timeAgo
}