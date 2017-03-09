Template.registerHelper('$selected', function(currentValue, optionValue) {
    return (currentValue == optionValue)
        ? "selected"
        : "";
});

Template.registerHelper('$lastIndex', function(obj, currentIndex) {
    console.log(obj);
    console.log(currentIndex);
    return;
});


Template.registerHelper('$checked', function(value) {
    return value ? 'checked' : '';
});

Template.registerHelper('$getObjectInArrayBySearchValueInKey', function(array, value, key) {
    let obj = false;
    if (typeof array !== 'object') {
        return obj;
    }
    for (let i = 0; i < array.length; i++) {
        obj = array[i];
        if (typeof obj[key] !== 'undefined' && obj[key] === value) {
            break;
        }
        obj = false;
    }
    return obj;
});
