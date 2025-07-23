(function() {
    "use strict"
    const utils = require("./utils")

    function Wordle(maxCount) {
        this.maxCount = maxCount
        this.wordLength = 5
        this.count = 0
        this.answerWord = null
        this.history = []
        this.rawHistory = []
        this.emoji = {Right:"✅", Contain:"⚠️", Wrong:"❌"}
        this.setAnswer()
    }

    Wordle.prototype.reset = function() {
        this.count = 0
        this.history = []
        this.setAnswer()
    }

    Wordle.prototype.setAnswer = function() {
        let words = utils.read_words("words.txt")
        let index = Math.random() * words.length | 0
        this.answerWord = words[index]
    }

    Wordle.prototype.guess = function(word) {
        if(word.length != this.wordLength) {
            throw new Error("5글자만 입력 가능합니다.")
        }
        if(!/[a-zA-Z]{5}/.test(word)) {
            throw new Error("알파벳만 입력 가능합니다.")
        }

        let words = utils.read_words("words.txt")
        let extended_words = utils.read_words("extended_words.txt")
        if(!words.includes(word) && !extended_words.includes(word)) {
            throw new Error("사용할 수 없는 단어입니다.")
        }

        word = word.toLowerCase()

        let result = []
        for(let i = 0; i < this.wordLength; i++) {
            let char = word[i]
            if(char == this.answerWord[i]) {
                result.push("Right")
            } else if(this.answerWord.includes(char)) {
                result.push("Contain")
            } else {
                result.push("Wrong")
            }
        }

        this.rawHistory.push([word, result])

        result = this.makeReply(word, result)
        this.history.push(result)
        this.count += 1

        let info = null
        if(word == this.answerWord) {
            info = "win"
        } else if(this.count == this.answerWord) {
            info = "lose"
        }

        return [result, info]
    }

    Wordle.prototype._guess = function(word) {
        let result = []
        for(let i = 0; i < this.wordLength; i++) {
            let char = word[i]
            if(char == this.answerWord[i]) {
                result.push("Right")
            } else if(this.answerWord.includes(char)) {
                result.push("Contain")
            } else {
                result.push("Wrong")
            }
        }
        this.rawHistory.push([word, result])
    }

    Wordle.prototype.makeReply = function(word, result) {
        let str = ""
        for(let i = 0; i < this.wordLength; i++) {
            str += "[" + word[i] + ":" + this.emoji[result[i]] + "] "
        }
        return str
    }

    Wordle.prototype.getHistory = function() {
        return this.history.join("/n/n")
    }

    Wordle.prototype.getLeftTry = function() {
        return this.maxCount - this.count
    }

    Wordle.prototype.revert = function() {
        if(this.count == 0) {
            return
        }
        this.count -= 1
        this.history.pop()
        this.rawHistory.pop()
    }

    module.exports = Wordle
})()