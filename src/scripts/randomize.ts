import { KanjiList } from "./data";

const randomize = <t extends KanjiList[] | string[][]>([...data]): t => {
    for(let i = data.length-1; i > 0; i--) {
        const r = Math.floor(Math.random() * data.length);

        [data[i], data[r]] = [data[r], data[i]];
    }
      
    return [...data] as t;
};

export default randomize;