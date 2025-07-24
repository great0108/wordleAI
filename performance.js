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
        let [remain, word] = wordleAI.inference(wordle.rawHistory)
        let [result, info] = wordle.guess(word)
        if(info == "win") {
            result += wordle.count
            break
        } else if(info == "lose") {
            console.log(answord + " 못 맞춤")
            result += wordle.count
            break
        }
    }
    console.log(answord, wordle.count)
}
console.log("------------------")
console.log("평균 시도 : " + result / words.length)