(function() {
    "use strict"
    const Wordle = require("./wordle")
    const WordleDict = require("./wordleDict")
    const utils = require("./utils")

    // 3.455
    function WordleAI() {
        this.game = new Wordle(6)
        this.dict = new WordleDict()
        this.words = this.dict.words
        this.ext_words = this.dict.extended_words
        this.epsilon = 1e-8
        this.firstChoose = utils.read_json("firstChoose2.json")
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
        }
        else if(candidate.length == 2) {
            return [1.5, candidate[0]]
        }

        let minGuess = 100
        let minGuessWord = null
        let wordle = new Wordle(6)
        wordle.rawHistory = history
        let results = []

        let wordList = candidate
        if(step == 0) {
            wordList = this.dict.words
        } else if(candidate.length > 20) {
            wordList = this.dict.words
        }

        for(let word of wordList) {
            let [partition, _] = this.getPartition(word, candidate, wordle)
            let result = this.simpleScore(partition) / candidate.length + 1

            if(step == 0 || candidate.length < 20) {
                results.push([word, result])
            } else {
                if(minGuess > result) {
                    minGuess = result
                    minGuessWord = word
                }
            }
        }

        if(minGuess <= 2) {
            return [minGuess, minGuessWord]
        }

        if(step == 0 || candidate.length < 20) {
            results.sort((a, b) => a[1] - b[1])
            results = results.slice(0, Math.min(10, results.length / 2 | 0))
            for(let result of results) {
                let [word, pred] = result
                let [partition, histories] = this.getPartition(word, candidate, wordle)
                let score = 0

                for(let key in partition) {
                    let a = this.avgGuessToWin(partition[key], histories[key], step+1)
                    score += a[0] * partition[key].length
                }
                score = score / candidate.length + 1
                // if(step == 0) {
                //     first[word] = score
                //     console.log(word, score)
                // }
                if(minGuess > score) {
                    minGuess = score
                    minGuessWord = word
                }
            }
        }

        return [minGuess, minGuessWord]
    }

    WordleAI.prototype.simpleScore = function(partition) {
        let result = 0
        for(let key in partition) {
            let part = partition[key]
            if(part.length == 1) {
                result += 1
            } else {
                result += (Math.log10(part.length)*1 + 1.19) * part.length
            }
        }
        return result
    }

    WordleAI.prototype.getPartition = function(word, candidate, wordle) {
        let partition = {}
        let histories = {}

        for(let w of candidate) {
            if(w == word) {
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
        return [partition, histories]
    }

    // let first = {}
    // let wordleAI = new WordleAI()
    // wordleAI.inference([])
    // const fs = require("fs")
    // fs.writeFileSync("firstChoose2.json", JSON.stringify(first))

    module.exports = WordleAI
})()