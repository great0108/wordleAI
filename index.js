(function() {
    "use strict"
    const Wordle = require("./wordle")
    const WordleDict = require("./wordleDict")
    const WordleAI = require("./wordleAI")

    module.exports = {
        Wordle : Wordle,
        WordleDict : WordleDict,
        WordleAI : WordleAI
    }
})()