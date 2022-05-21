
export const capitalize = (input) => {
    return input.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

export const makeSingular = str => str.substr(0,str.length-1)