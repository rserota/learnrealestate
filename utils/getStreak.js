// checks the user's streak immediately when they visit the homepage
var getStreak = function(theUser){
    var now = new Date()
    var lastLessonDate = theUser.pastLessonDates[theUser.pastLessonDates.length-1]
    var streakMessage = ''
    if ( now.toDateString() === lastLessonDate.toDateString() ) {
        //Their last lesson was earlier today. Don't update their streak. 
        console.log("Their last lesson was earlier today. Don't update their streak.")
        streakMessage = "Your streak is safe for today."
    }
    else if ( (now - lastLessonDate) > 93600000 ) {
        //It's been more than 26 hours since their last lesson. set their streak to 1
        theUser.currentDayStreak = 0
        streakMessage = "You haven't taken a lesson in a while. Take a lesson to start your daily streak."
    }
    else {
        //Their last lesson was less than a day ago, but it WAS on a different day. 
        console.log('they still need to take a lesson today to protect their streak')
        streakMessage = "You need to take a lesson today, or you'll break your streak."
    }
    return streakMessage

    
}

module.exports = getStreak
