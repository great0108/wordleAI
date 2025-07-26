const {Wordle, WordleDict, WordleAI} = require("../wordleAI")

let game = false
let wordle = new Wordle(6)
let wordleDict = new WordleDict()
let wordleAI = new WordleAI()

function onMessage(msg) {
    if(msg.content == "워들") {
        wordle.reset()
        game = true
        let [remain, word] = wordleAI.inference(wordle.rawHistory)
        msg.reply("AI 추천 단어 : " + word + "  예측한 남은 추측 수 : " + remain)
        msg.reply('단어 입력 : /-----, 히스토리 보기 : h, 남은 단어 보기 : l')
    }

    if(game) {
        if(msg.content.startsWith("/")) {
            let word = msg.content.slice(1)
            try {
                let [result, info] = wordle.guess(word)
                if(info == null) {
                    msg.reply("남은 횟수 : " + wordle.getLeftTry())
                } else if(info == "win") {
                    msg.reply("정답입니다!")
                    game = false
                } else if(info == "lose") {
                    msg.reply("게임 오버")
                    msg.reply("정답 : " + wordle.answerWord)
                    game = false
                }
                msg.reply(result)

                if(info == null) {
                    let [remain, word] = wordleAI.inference(wordle.rawHistory)
                    msg.reply("AI 추천 단어 : " + word + "  예측한 남은 추측 수 : " + remain)
                    msg.reply('단어 입력 : /-----, 히스토리 보기 : h, 남은 단어 보기 : l')
                }
            } catch(e) {
                msg.reply(e.message)
            }
        }
        if(msg.content == "h") {
            msg.reply(wordle.getHistory())
        }
        if(msg.content == "l") {
            let cond = wordleDict.historyToCond(wordle.rawHistory)
            let candidate = wordleDict.search(cond)
            msg.reply("가능한 단어\n\n" + candidate.join("\n"))
        }
    }
}