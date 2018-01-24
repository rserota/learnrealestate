console.log('hi') 
var lessonList = new Vue({
    el: '#lesson-list',
    data: {
        user: user
    },
    methods:{
        setProgressBarStyleFor: function(lessonNumber){
            if ( this.user.lessonMastery[lessonNumber] ) {
                return `width:${this.user.lessonMastery[lessonNumber]}%; display:block` 
            }
            else {
                return ''
            }
        } 
    }
})
