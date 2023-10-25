const randomize = ([...data]): ReadonlyArray<Array<string>> => {
    for(let i = data.length-1; i > 0; i--) {
        const r = Math.floor(Math.random() * data.length);

        [data[i], data[r]] = [data[r], data[i]];
    }
      
    return data;
};

export default randomize;