// updates the user's streak immediately after they take a lesson
var setStreak = function(theUser){
    var now = new Date()
    var lastLessonDate = theUser.pastLessonDates[theUser.pastLessonDates.length-1]
    if ( now.toDateString() === lastLessonDate.toDateString() ) {
        //Their last lesson was earlier today. Don't update their streak. 
        console.log("Their last lesson was earlier today. Don't update their streak.")
    }
    else if ( (now - lastLessonDate) > 93600000 ) {
        //It's been more than 26 hours since their last lesson. set their streak to 1
        console.log('its been more than 26 hours. streak resets to 1')
        theUser.currentDayStreak = 1 
    }
    else {
        //Their last lesson was less than a day ago, but it WAS on a different day. 
        theUser.currentDayStreak++
    }
    console.log('end set streak')

}

module.exports = setStreak
