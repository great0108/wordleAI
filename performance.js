"use strict"
const Wordle = require("./wordle")
const WordleAI = require("./wordleAI")
const utils = require("./utils")

let words = utils.read_words("words.txt")
let wordle = new Wordle(6)
let wordleAI = new WordleAI()
let result = 0
for(let answord of words) {
    wordle.reset()
    wordle.setAnswer(answord)

    while(true) {
        let [word, remain] = wordleAI.inference(wordle.rawHistory)
        let [_, info] = wordle.guess(word)
        if(info == "win") {
            break
        } else if(info == "lose") {
            console.log(answord + " 못 맞춤")
            break
        }
    }
    result += wordle.count
    console.log(answord, wordle.count)
}
result /= words.length
console.log("------------------")
console.log("평균 시도 : " + result)