var learnLesson = (function(){

    questions.sort(function(a, b){
        if ( !(a._id in user.pastAnswers) && !(b._id in user.pastAnswers) ){
            // the user hasn't correctly answered either of these questions
            return 0
        }
        else if ( !(a._id in user.pastAnswers) ){
            // the user hasn't correctly answered question a
            return -1
        }
        else if ( !(b._id in user.pastAnswers) ){
            // the user hasn't correctly answered question b
            return 1
        }
        else {
            // the user has seen both questions. which one have they correctly answered the least?
            return user.pastAnswers[a._id] - user.pastAnswers[b._id]
        }
    })
    var quizLength = 10
    questions = questions.slice(0,quizLength)
    shuffle(questions)
    questions.forEach(function(el){
        shuffle(el.answers)
    })
    
    var learnLesson = new Vue({ 
        el : '#learn-lesson-container',
        data : {
            loggedIn : !!user,
            user : user,
            questions : questions,
            definitions: definitions,
            numAnswered: 0,
            chosenAnswer : null,
            transparent: false,
            answerChoicesAreTransparent: false,
            rationaleIsTransparent: true,
            answerChoicesAreDisplayed: true,
            rationaleIsDisplayed: false,
            submitIsDisabled: true,
            nextIsDisabled: true,
            quizIsDone: false,
            gjSfx: null,
            nopeSfx: null,
            //pastAnswers: [],
        },
        
        created : function(){
            window.addEventListener('keydown', this.keydown)
            this.gjSfx = new Howl({
                src: ['/audio/goodJob.wav'],
            })
            this.nopeSfx = new Howl({
                src: ['/audio/nope.wav'],
            })
            
        },

        methods : {
            tagTheRationale : function(){
                this.definitions.forEach(function(definition){
                    $(`[data-tooltip="${definition.definitionTag}"]`).attr('data-toggle', 'tooltip').attr('title', definition.definition)
                })
                $('[data-toggle="tooltip"]').tooltip()
            },
            submitAnswer : function(){
                if ( this.submitIsDisabled ) { return }
                if ( this.chosenAnswer.correct ) {
                    this.gjSfx.play()
                }
                else if ( !this.chosenAnswer.correct ) {
                    this.nopeSfx.play()
                }
                this.answerChoicesAreTransparent = true
                this.submitIsDisabled = true
                if ( this.chosenAnswer.correct ) {
                    if ( !(this.questions[0]._id in this.user.pastAnswers) ){
                        this.user.pastAnswers[this.questions[0]._id] = {
                            count: 1,
                            lessonName: this.questions[0].lessonName,
                            lessonNumber: this.questions[0].lessonNumber,
                            section: this.questions[0].section,
                        }
                    }
                    else if ( this.questions[0]._id in this.user.pastAnswers ) {
                        this.user.pastAnswers[this.questions[0]._id].count++
                    }
                }
                
                setTimeout(()=>{
                    this.answerChoicesAreDisplayed = false
                    this.nextIsDisabled = false
                    this.rationaleIsDisplayed = true
                    this.tagTheRationale()
                    setTimeout(()=>{ this.rationaleIsTransparent= false },1)
                },400)
            },

            nextQuestion : function(){
                 // the quiz continuesk
                if ( this.questions.length > 1 ) {
                    this.transparent = true
                    this.chosenAnswer = null
                    setTimeout(()=>{
                        if (this.questions.length > 1) {this.questions.shift()}
                        this.answerChoicesAreDisplayed = true
                        this.answerChoicesAreTransparent = false
                        this.nextIsDisabled = false
                        this.rationaleIsDisplayed = false
                        this.rationaleIsTransparent = true
                        this.transparent = false
                        this.numAnswered++
                    },400)
                }
        
                // this quiz is over
                else {
                    this.quizIsDone = true
                    $.ajax({
                        url : '/past-answers',
                        type : 'POST',
                        data : {user: this.user},

                    }).then((data)=>{
                        var newUrl = window.location.href.split('/')
                        newUrl[newUrl.length-1] = 'overview'
                        window.location.href = newUrl.join('/')
                    })
                }
           
            },

            chooseAnAnswer : function(){
                this.submitIsDisabled = false
            },

            keydown : function(event){
                if ( !learnLesson.answerChoicesAreTransparent ) { 
                    if ( event.code === "Digit1" ) {
                        $('.first-choice').trigger('click')
                    }
                    else if ( event.code === "Digit2" ) {
                        $('.second-choice').trigger('click')
                    }
                    else if ( event.code === "Digit3" ) {
                        $('.third-choice').trigger('click')
                    }
                    else if ( event.code === "Digit4" ) {
                        $('.fourth-choice').trigger('click')
                    }
                }
                if ( event.code === "Space" ) {
                    event.preventDefault()
                    if ( learnLesson.answerChoicesAreDisplayed ) {
                        if ( learnLesson.chosenAnswer != null ) {
                            $('.submit-answer').trigger('click')
                        }
                    }
                    else if ( learnLesson.rationaleIsDisplayed && !this.transparent ) {
                        $('.next-question').trigger('click')
                    }
                }
            }
        }
    })

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    return learnLesson
})()
