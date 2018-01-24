var dashboardOrMarketing = new Vue({
    el: '#dashboard-or-marketing',
    data: {
        xp: 0,
        levelTitles: [
            'Aspiring Agent',
            'Novice Agent',
            'Fledgling Agent',
            'Beginner Agent',
            'Apprentice Agent',
            'Journeyman Agent',
            'Seasoned Agent', 
            'Master Agent',
            'Heroic Agent',
            'Epic Agent',
            'Legendary Agent',
            'Mythic Agent',
            'Divine Agent',
            'The Greatest Agent In All Of America In General, And Colorado In Particular',

        ],
        streakGaugeImageSources: [
            '/images/streak-gauge/streakgauge-0.png',
            '/images/streak-gauge/streakgauge-1.png',
            '/images/streak-gauge/streakgauge-2.png',
            '/images/streak-gauge/streakgauge-3.png',
            '/images/streak-gauge/streakgauge-4.png',
            '/images/streak-gauge/streakgauge-5.png',
        ],
    },
    computed: {
        user: function(){
            return profileOrLogin.user
        },
        level: function(){
            return Math.floor(Math.sqrt(this.xp))
        },
        toNextLevel: function(){
            return Math.floor((Math.sqrt(this.xp) - this.level)*100) + '%'
        },
        loggedIn: function(){
            return profileOrLogin.loggedIn
        },
        streakMessage: function(){
            var now = new Date()
            var lastLessonDate = new Date(this.user.pastLessonDates[this.user.pastLessonDates.length-1])
            var streakMessage = ''
            if ( now.toDateString() === lastLessonDate.toDateString() ) {
                //Their last lesson was earlier today. Don't update their streak. 
                console.log("Their last lesson was earlier today. Don't update their streak.")
                streakMessage = "Your streak is safe for today."
            }
            else if ( (now - lastLessonDate) > 93600000 ) {
                //It's been more than 26 hours since their last lesson. set their streak to 1
                this.user.currentDayStreak = 0
                streakMessage = "Take a lesson to start your daily streak."
            }
            else {
                //Their last lesson was less than a day ago, but it WAS on a different day. 
                console.log('they still need to take a lesson today to protect their streak')
                streakMessage = "Take a lesson today, or you'll break your streak."
            }
            return streakMessage
        },

        progressBreakdown: function(section){
            if ( !user ) { return {} }
            var totalCorrect = 0
            var progressBreakdownObj = {
                "Law And Practice":0,
                remaining: sectionTotals.total,
            }
            for ( var key in user.pastAnswers ) {
                if ( user.pastAnswers[key].count > 0 ) {
                    progressBreakdownObj[user.pastAnswers[key].section]++
                    totalCorrect++
                    progressBreakdownObj.remaining--
                }
            }
            this.xp = totalCorrect
            return progressBreakdownObj
        },

    },
    methods:{
        drawChart: function() {
            
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Section');
            data.addColumn('number', 'Completion');
            data.addRows([
                ['Law and Practice', this.progressBreakdown["Law And Practice"]],
                ['Contracts and Regulations', 0],
                ['Trust Accounts', 0],
                ['Current Legal Issues', 0],
                ['Real Estate Closings', 0],
                ['Practical Applications', 0],
                ['Test Prep (done)', 0],
                ['Remaining', this.progressBreakdown.remaining] 
            ]);

            // Set chart options
            var options = {
                //title:'Course Progress Breakdown',// can't center titles! argh
                width:Math.max(300, document.body.clientWidth / 3),
                height:Math.max(300, document.body.clientWidth / 3),
                pieHole: .01, // spectrum from donut to pie. lol.
                pieSliceText: 'none',
                pieSliceBorderColor: 'black',
                chartArea:{
                    width: '95%',
                },
                //is3D:true,
                pieStartAngle: 30,
                slices: [
                    {color : 'red', offset: .3},
                    {color : '#a0f0a1', offset: .3},
                    {color : 'green', offset: .3},
                    {color : 'purple', offset: .3},
                    {color : 'papayawhip', offset: .3},
                    {color : 'burlywood', offset: .3},
                    {color : 'peachpuff', offset: .3},
                    {color : 'lightgray'},
                ],
                tooltip : {
                    text: 'percentage'
                },
                legend: {
                    position: 'labeled',
                },
                //backgroundColor: '#f5f5f5',
                
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('progress-pie-chart'));
            chart.draw(data, options);
        }

       
    },
    created : function(){
        // need to redraw the chart when we cross a bootstrap breakpoint
        google.charts.load('current', {'packages':['corechart']});
        if ( this.user ) {
                try {
                    dashboardOrMarketing.drawChart()
                console.log('user!')
                }
                catch(e){
                    google.charts.setOnLoadCallback(this.drawChart)
                }
        }
        else {
            $(document).one('user-logged-in',function(e){
                console.log('user logged in!')
                dashboardOrMarketing.$nextTick().then(function(){
                    try {
                        dashboardOrMarketing.drawChart()
                    } catch(e){
                        console.log('caught')
                        google.charts.setOnLoadCallback(dashboardOrMarketing.drawChart)
                    }

                })
            })
        }

        // Load the Visualization API and the corechart package.

    },
})
