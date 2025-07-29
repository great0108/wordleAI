"use strict"
const Wordle = require("./wordle")
const WordleDict = require("./wordleDict")
const WordleAI = require("./wordleAI")
const readline = require('readline');

let wordle = new Wordle(6)
let wordleDict = new WordleDict()
let wordleAI = new WordleAI()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt) {
    return new Promise(resolve => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
    let end = false
    let game = false
    while(!end) {
        if(!game) {
            let answer = await input('게임 시작 y/n ')
            if(answer == "y") {
                wordle.reset()
                game = true
            }
            if(answer == "n") {
                end = true
            }
        }

        if(game) {
            let [word, remain] = wordleAI.inference(wordle.rawHistory)
            console.log("AI 추천 단어 : " + word + "  예측한 남은 추측 수 : " + remain)
            // console.log(wordleAI.inference(wordle.rawHistory, true))
            // console.log(wordleAI.guessWord(wordle.rawHistory, "about"))
            let answer = await input('단어 입력 : /-----, 히스토리 보기 : h ')
            if(answer.startsWith("/")) {
                let word = answer.slice(1)
                try {
                    let [result, info] = wordle.guess(word)
                    if(info == null) {
                        console.log("남은 횟수 : " + wordle.getLeftTry())
                    } else if(info == "win") {
                        console.log("정답입니다!")
                        game = false
                    } else if(info == "lose") {
                        console.log("게임 오버")
                        console.log("정답 : " + wordle.answerWord)
                        game = false
                    }
                    console.log(result)
                } catch(e) {
                    // console.log(e)
                    console.log(e.message)
                }
                
                let cond = wordleDict.historyToCond(wordle.rawHistory)
                let candidate = wordleDict.search(cond)
                console.log(cond)
                console.log(candidate)
            }
            if(answer == "h") {
                console.log(wordle.getHistory())
            }
        }
    }

    console.log("게임 종료")
    rl.close();
}

main()
// let history = [["slate", "WWWWW"]]
// let start = Date.now()
// for(let i = 0; i < 10; i++) {
//     // let a = wordle.onlyGuess(word)
//     wordleAI.inference(history)
// }
// let end = Date.now()
// console.log(end - start)
