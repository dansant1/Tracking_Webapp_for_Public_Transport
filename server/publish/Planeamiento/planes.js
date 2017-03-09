Meteor.publish('planes', function (ida) {
    if (this.userId) {
        return Plan.find({ida: ida})
    } else {
        this.stop();
        return;
    }
})


Meteor.publish('planes2', function () {
    if (this.userId) {
        return Plan.find()
    } else {
        this.stop();
        return;
    }
})
