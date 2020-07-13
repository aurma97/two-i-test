
import {mapValues, groupBy} from 'lodash';

export const groupByRollup = function (seq, keys) {
    if (!keys.length)
        return seq;
    var first = keys[0];
    var rest = keys.slice(1);
    return mapValues(groupBy(seq, first), function (value) { 
        return JSON.parse(JSON.stringify(groupByRollup(value, rest)))
    });
};

export const resultByDate =  (array) => {
    let result = [];
    Object.keys(array).map((data) => {
        result.push([ data, array[data].length])
    })
    return result;
}

export const resultByCamera =  (array) => {
    let result = [];
    Object.keys(array).map((data) => {
        result.push([ data === "true" ? "Connectée(s)" : "Déconnectée(s)", array[data].length])
    })
    return result;
}