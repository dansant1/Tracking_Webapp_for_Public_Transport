Entidades = new Mongo.Collection('entidades');

Entidades.allow({
    insert: () => {return false},
    update: () => {return false},
    remove: () => {return false}
});

Entidades.deny({
    insert: () => {return true},
    update: () => {return true},
    remove: () => {return true}
});