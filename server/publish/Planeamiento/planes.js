Meteor.publish('planes', function (ida) {
    if (this.userId) {
        return Plan.find({ida})
    } else {
        this.stop();
        return;
    }
})
