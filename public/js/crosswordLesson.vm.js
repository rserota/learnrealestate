var crosswordLesson = new Vue({
    el: '#crossword',
    data: {
        foo:'bar'
    },
    methods:{
        validateCrossword: function(){
            var isValid = true
            $('#crossword input').each(function(index, el){
                var $el = $(el)
                if ( $el.attr('data-answer') != $el.val() ) {
                    isValid = false
                }

            })
            return isValid
        },

        areWeDoneYet: function(){
            if (this.validateCrossword()) {
                console.log('you did it!')
                var newUrl = window.location.href.split('/')
                newUrl[newUrl.length-1] = 'overview'
                window.location.href = newUrl.join('/')

            }
            else { console.log("you're not done yet!") }
        }

    },

    created: function(){
        var words = []
        var clues = []
        shuffle(definitions)
        for ( var i = 0; i < definitions.length; i++ ) {
            if ( definitions[i].definitionName.length < 15 ) {
                words.push(definitions[i].definitionName)
                clues.push(definitions[i].definition)
            }
        }
        words = words.slice(0,9)
        clues = clues.slice(0,9)

        // Create crossword object with the words and clues
        var cw = new Crossword(words, clues);

        // create the crossword grid (try to make it have a 1:1 width to height ratio in 10 tries)
        var tries = 10; 
        var grid = cw.getSquareGrid(tries);

        // report a problem with the words in the crossword
        if(grid == null){
            var bad_words = cw.getBadWords();
            var str = [];
            for(var i = 0; i < bad_words.length; i++){
                str.push(bad_words[i].word);
            }
            alert("Shoot! A grid could not be created with these words:\n" + str.join("\n"));
            return;
        }

        // turn the crossword grid into HTML
        var show_answers = true;
        document.getElementById("crossword").innerHTML = CrosswordUtils.toHtml(grid, show_answers);

        // make a nice legend for the clues
        var legend = cw.getLegend(grid);
        addLegendToPage(legend);

        $('td[style*="background-image"]').each(function(index, el){
            var wordNumber = parseInt($(el).attr('style').replace(/\D+/g,''))
            for ( var group in groups ) {
                for ( var i = 0; i < groups[group].length; i++ ){
                    if (groups[group][i].position === wordNumber){
                        $(el).attr('title', groups[group][i].clue)
                    }
                }
            }
        })

    }
})


window.onload = function(){
    // words[i] correlates to clues[i]
    //var words = ["dog", "cat", "bat", "elephant", "kangaroo"];
    //var clues = ["Man's best friend", "Likes to chase mice", "Flying mammal", "Has a trunk", "Large marsupial"];

};


function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

