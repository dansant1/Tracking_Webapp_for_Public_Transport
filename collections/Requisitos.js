Requisitos = new Mongo.Collection('requisitos');

Requisitos.allow({
    insert: () => {return false},
    update: () => {return false},
    remove: () => {return false}
});

Requisitos.deny({
    insert: () => {return true},
    update: () => {return true},
    remove: () => {return true}
});

