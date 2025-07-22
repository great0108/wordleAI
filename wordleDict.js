(function() {
    "use strict"
    const utils = require("./utils")

    function WordleDict() {
        this.words = utils.read_words("words.txt")
        this.extended_words = utils.read_words("extended_words.txt")
        this.wordLength = 5
    }

    WordleDict.prototype.search = function(cond) {
        // {fixed : {a : 1}, loose : {b : [1, 2]}, exclude : [c], extend : false}

        let words = this.words
        if(cond.extend) {
            words = words.concat(extended_words)
        }

        if(cond.fixed) {
            words = this.filterFixed(words, cond.fixed)
        }

        if(cond.exclude) {
            words = this.filterExclude(words, cond.exclude)
        }

        if(cond.loose) {
            words = this.filterLoose(words, cond.loose)
        }

        return words
    }

    WordleDict.prototype.filterFixed = function(words, fixed) {
        let regex = ".".repeat(this.wordLength)
        for(let key in fixed) {
            regex[fixed[key]] = key
        }
        regex = new RegExp(regex)

        let result = []
        for(let i = 0; i < words.length; i++) {
            if(regex.test(words[i])) {
                result.push(words)
            }
        }
        return result
    }

    WordleDict.prototype.filterLoose = function(words, loose) {
        let result = []
        for(let i = 0; i < words.length; i++) {
            let match = true
            for(let key in loose) {
                if(!words[i].includes(key)) {
                    match = false
                    break
                }
                for(let index of loose[key]) {
                    if(words[i][index] == key) {
                        match = false
                        break
                    }
                }
                if(!match) {
                    break
                }
            }

            if(match) {
                result.push(words[i])
            }
        }
        return result
    }

    WordleDict.prototype.filterExclude = function(words, exclude) {
        let regex = "[^" + exclude.join("") + "]"
        regex = new RegExp(regex)

        let result = []
        for(let i = 0; i < words.length; i++) {
            if(regex.test(words[i])) {
                result.push(words[i])
            }
        }
        return result
    }

    WordleDict.prototype.historyToCond = function(history) {
        // [["about", ["Right", "Contain", "Wrong", "Wrong", "Wrong"]], ...]
        let fixed = {}
        let loose = {}
        let exclude = []

        for(let h of history) {
            let [word, result] = h
            for(let i = 0; i < this.wordLength; i++) {
                let char = word[i]
                if(result[i] == "Right") {
                    fixed[char] = i
                } else if(result[i] == "Contain") {
                    if(char in loose && !loose[char].includes(i)) {
                        loose[char].push(i)
                    } else {
                        loose[char] = [i]
                    }
                } else if(result[i] == "Wrong") {
                    if(!exclude.includes(char)) {
                        exclude.push(char)
                    }
                }
            }
        }

        for(let key in fixed) {
            if(key in loose) {
                delete loose[key]
            }
        }
        return {fixed : fixed, loose : loose, exclude : exclude}
    }

    module.exports = WordleDict
})()