export const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  let length = arr1.length;
  let i = 0;
  let areEqual = true;

  while (areEqual && i<length) {
    let item1 = arr1[i];
    let item2 = arr2[i];
    areEqual = Object.keys(item1).length === Object.keys(item2).length;
    for (const property in item1) {
      areEqual = item1[property] === item2[property];
    }
    i++
  }
  return areEqual;
}


export const deepCopy = arr => {
  let array = [];
    arr.forEach(item => {
        array.push({...item})
    });
    return array;
};
