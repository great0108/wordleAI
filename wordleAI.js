(function() {
    "use strict"
    const Wordle = require("./wordle")
    const WordleDict = require("./wordleDict")
    const utils = require("./utils")
    let first = {}

    function WordleAI() {
        this.game = new Wordle(6)
        this.dict = new WordleDict()
        this.words = this.dict.extended_words
        this.epsilon = 1e-8
        this.firstChoose = utils.read_json("firstChoose.json")
    }

    WordleAI.prototype.inference = function(history) {
        if(history.length == 0) {
            let minGuess = 100
            let minGuessWord = null
            for(let word in this.firstChoose) {
                if(minGuess > this.firstChoose[word]) {
                    minGuess = this.firstChoose[word]
                    minGuessWord = word
                }
            }
            return [minGuess, minGuessWord]
        }
        let cond = this.dict.historyToCond(history)
        let candidate = this.dict.search(cond)
        return this.avgGuessToWin(candidate, history, 0)
    }

    WordleAI.prototype.avgGuessToWin = function(candidate, history, step) {
        if(candidate.length == 1) {
            return [1, candidate[0]]
        } else if(candidate.length == 2) {
            return [1.5, candidate[0]]
        } else if(step >= 1 && candidate.length > 200) {
            return [Math.log10(candidate.length)*0.9 + 1.2, candidate[0]] // approximate
        } else if(step >= 2 && candidate.length > 30) {
            return [Math.log10(candidate.length)*0.9 + 1.2, candidate[0]] // approximate
        } else if(step >= 3 && candidate.length > 10) {
            return [Math.log10(candidate.length)*0.9 + 1.2, candidate[0]] // approximate
        }

        let minGuess = 100
        let minGuessWord = null
        let minimum = 1 + (candidate.length-1) / candidate.length + this.epsilon
        let wordle = new Wordle(6)
        wordle.rawHistory = history

        for(let word of candidate) {
            let partition = {}
            let histories = {}
            let result = 0

            for(let w of candidate) {
                if(w == word) {
                    result += 1
                    continue
                }

                wordle.answerWord = w
                let h = wordle._guess(word)
                
                if(h in partition) {
                    partition[h].push(w)
                } else {
                    partition[h] = [w]
                    histories[h] = wordle.rawHistory.slice()
                }
                wordle.rawHistory.pop()
            }

            for(let key in partition) {
                let a = this.avgGuessToWin(partition[key], histories[key], step+1)
                result += (a[0]+1) * partition[key].length
            }
            result /= candidate.length

            // if(step == 0) {
            //     console.log(word, result)
            // }

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

    // let wordleAI = new WordleAI()
    // wordleAI.inference([])

    module.exports = WordleAI
})()