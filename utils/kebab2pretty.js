// converts strings from kebab-case (law-and-practice) to a human-friendly string (Law And Practice)
var kebab2pretty = function(str){
    return str.split('-').map(function(word){
        var wordAsArray = word.split('')
        wordAsArray[0] = wordAsArray[0].toUpperCase()
        return wordAsArray.join('')
    }).join(' ')
}

module.exports = kebab2pretty
