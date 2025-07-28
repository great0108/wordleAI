(function() {
    "use strict"
    const Wordle = require("./wordle")
    const WordleDict = require("./wordleDict")
    const utils = require("./utils")

    // 3.455
    function WordleAI() {
        this.wordle = new Wordle(6)
        this.dict = new WordleDict()
        this.words = this.dict.words
        this.ext_words = this.dict.extended_words
        this.epsilon = 1e-8
        this.firstChoose = utils.read_json("firstChoose.json")
    }

    WordleAI.prototype.inference = function(history, order) {
        if(history.length == 0) {
            let minGuess = 100
            let minGuessWord = null
            let words = []
            for(let word in this.firstChoose) {
                words.push([word, this.firstChoose[word]])
                if(minGuess > this.firstChoose[word]) {
                    minGuess = this.firstChoose[word]
                    minGuessWord = word
                }
            }
            if(order) {
                words.sort((a, b) => a[1] - b[1])
                return words
            }
            return [minGuessWord, minGuess]
        }
        let cond = this.dict.historyToCond(history)
        let candidate = this.dict.search(cond)
        return this.avgGuessToWin(candidate, history.slice(), 0, order)
    }

    WordleAI.prototype.guessWord = function(history, word) {
        let cond = this.dict.historyToCond(history)
        let candidate = this.dict.search(cond)

        let [partition, histories] = this.getPartition(word, candidate, history.slice())
        let score = 0

        for(let key in partition) {
            let a = this.avgGuessToWin(partition[key], histories[key], 1)
            score += a[1] * partition[key].length
        }
        score = score / candidate.length + 1
        return score
    }

    WordleAI.prototype.avgGuessToWin = function(candidate, history, step, order) {
        if(candidate.length == 1) {
            if(order) {
                return [[candidate[0], 1]]
            }
            return [candidate[0], 1]
        }
        else if(candidate.length == 2) {
            if(order) {
                return [[candidate[0], 1.5], [candidate[1], 1.5]]
            }
            return [candidate[0], 1.5]
        }

        let minGuess = 100
        let minGuessWord = null
        history.push([])
        let results = []

        let wordList = candidate
        if(step == 0) {
            wordList = this.dict.words
        } else if(candidate.length > 40) {
            wordList = this.dict.words
        }

        for(let word of wordList) {
            let [partition, _] = this.getPartition(word, candidate, history)
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

        if(minGuess <= 2 && !order) {
            return [minGuessWord, minGuess]
        }

        let words = []
        if(step == 0 || candidate.length < 20) {
            results.sort((a, b) => a[1] - b[1])
            results = results.slice(0, Math.min(10, results.length / 2 | 0))

            for(let result of results) {
                let [word, pred] = result
                let [partition, histories] = this.getPartition(word, candidate, history)
                let score = 0

                for(let key in partition) {
                    let a = this.avgGuessToWin(partition[key], histories[key], step+1)
                    score += a[1] * partition[key].length
                }
                score = score / candidate.length + 1
                words.push([word, score])
                // if(step == 0) {
                //     first[word] = score
                //     console.log(word, score, pred)
                // }
                if(minGuess > score) {
                    minGuess = score
                    minGuessWord = word
                }
            }
        }

        if(order) {
            words.sort((a, b) => a[1] - b[1])
            return words
        }
        return [minGuessWord, minGuess]
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

    WordleAI.prototype.getPartition = function(word, candidate, history) {
        let partition = {}
        let histories = {}
        let lastHistIdx = history.length - 1
        let wordle = this.wordle

        for(let w of candidate) {
            if(w == word) {
                continue
            }
            wordle.answerWord = w
            let result = wordle.onlyGuess(word)
            
            if(result in partition) {
                partition[result].push(w)
            } else {
                partition[result] = [w]

                let hist = history.slice()
                hist[lastHistIdx] = [word, result]
                histories[result] = hist
            }
        }
        return [partition, histories]
    }

    // let first = {}
    // let wordleAI = new WordleAI()
    // wordleAI.inference([])
    // const fs = require("fs")
    // fs.writeFileSync("firstChoose.json", JSON.stringify(first))

    module.exports = WordleAI
})()