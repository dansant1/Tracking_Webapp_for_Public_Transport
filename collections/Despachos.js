Despachos = new Mongo.Collection('despachos');

Despachos.allow({
    insert: () => {return false},
    update: () => {return false},
    remove: () => {return false}
});

Despachos.deny({
    insert: () => {return true},
    update: () => {return true},
    remove: () => {return true}
});