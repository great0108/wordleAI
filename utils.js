(function() {
    "use strict"
    const setting = require("./setting")

    function read_words(path) {
        let words = null
        if(setting.nodeJS) {
            const fs = require("fs")
            words = fs.readFileSync(path, "utf-8")
        } else {
            words = FileStream.read("./" + path)
        }
        let result = words.split("\n")
        return result
    }

    module.exports = {
        read_words : read_words
    }
})()