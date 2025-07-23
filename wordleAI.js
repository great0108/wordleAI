(function() {
    "use strict"
    const Wordle = require("./wordle")
    const WordleDict = require("./wordleDict")

    function WordleAI() {
        this.game = new Wordle(6)
        this.dict = new WordleDict()
        this.words = this.dict.extended_words
        this.epsilon = 1e-8
    }

    WordleAI.prototype.inference = function(history) {
        let cond = this.dict.historyToCond(history)
        let candidate = this.dict.search(cond)
        return this.avgGuessToWin(candidate, history, 0)
    }

    WordleAI.prototype.a = function(candidate, history, step) {
        if(candidate.length == 1) {
            return 1
        } else if(candidate.length == 2) {
            return 1.5
        } else if(step >= 3 && candidate.length > 5) {
            return Math.log10(candidate.length) + 1 // approximate
        }

        let minGuess = 100
        let minGuessWord = null
        let minimum = 1 + (candidate.length-1) / candidate.length + this.epsilon
        for(let word of candidate) {
            for(let answer of candidate) {
                this.game._guess(word)
            }
        }
    }

    WordleAI.prototype.avgGuessToWin = function(candidate, history, step) {
        if(candidate.length == 1) {
            return 1
        } else if(candidate.length == 2) {
            return 1.5
        } else if(step >= 3 && candidate.length > 5) {
            return Math.log10(candidate.length) + 1 // approximate
        }

        let minGuess = 100
        let minGuessWord = null
        let minimum = 1 + (candidate.length-1) / candidate.length + this.epsilon
        let lowermin = 2 + this.epsilon
        this.dict.words = candidate

        let wordle = new Wordle(6)
        wordle.rawHistory = history

        for(let word of candidate) {
            let wordSet = new Set()
            let partition = []
            let histories = []
            let result = 0

            for(let w of candidate) {
                if(wordSet.has(w)) {
                    continue
                }

                wordle.answerWord = w
                wordle._guess(word)
                let cond = this.dict.historyToCond(wordle.rawHistory)
                let wordList = this.dict.search(cond)

                histories.push(wordle.rawHistory.slice())
                wordle.rawHistory.pop()
                for(let a of wordList) {
                    wordSet.add(a)
                }
                partition.push(wordList)

            }

            let temp = Array.prototype.concat.apply([], partition)
            if(temp.length != candidate.length) {
                console.log(word)
                console.log(partition)
                // console.log(histories)
                console.log(candidate)
                console.log(history)
                throw new Error("")
            }
            // console.log(partition)

            for(let i = 0; i < partition.length; i++) {
                let a = this.avgGuessToWin(partition[i], histories[i], step+1)
                result += (a[0]+1) * partition[i].length
            }
            result /= candidate.length

            if(step == 0) {
                console.log(word, result)
            }

            if(minGuess > result) {
                minGuess = result
                minGuessWord = word
            }
            if(minimum > result) {
                break
            }
        }

        return [minGuess, minGuessWord]
    }

    let wordleAI = new WordleAI()
    let [remain, word] = wordleAI.inference([])

    module.exports = WordleAI
})()