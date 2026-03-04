module.exports.kebabToCamel = function(str) {
    let camelCase = '';
    let capitalizeNext = false;
  
    for (let char of str) {
      if (char === '-') {
        capitalizeNext = true;
      } else {
        camelCase += capitalizeNext ? char.toUpperCase() : char;
        capitalizeNext = false;
      }
    }
  
    return camelCase;
  }