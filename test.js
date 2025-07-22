"use strict"
const Wordle = require("./wordle")
const WordleDict = require("./wordleDict")
const readline = require('readline');

let wordle = new Wordle(6)
let wordleDict = new WordleDict()
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
// let words = "abcde"
// let loose = {"a" : [2, 3], "f" : [1]}
// let regex = /.[^f][^a][^a]./
// let start = Date.now()
// let result = []
// for(let i = 0; i < 10000000; i++) {
//     let match = true
//     for(let key in loose) {
//         if(!words.includes(key)) {
//             match = false
//             break
//         }
//     }
//     regex.test(words)
// }
// let end = Date.now()
// console.log(end - start)