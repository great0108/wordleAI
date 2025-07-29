# WordleAI
A lightweight wordle-solver with tree search.

It takes an average of ~3.45 guesses per win, only takes 1-2 minutes to run for all 2315 Wordle words.

## Get started
Download and import module to start.
```javascript
const { Wordle, WordleDict, WordleAI } = require("wordleAI");
```

## How To Use
```javascript
let wordle = new Wordle(maxCount)  // maxCount : 최대 추측 횟수
wordle.rawHistory  // 이전 추측했던 단어와 결과가 [[word, result], ... ] 형식으로 담겨있음
wordle.answerWord  // 정답 단어
wordle.count  // 지금까지 시도한 횟수

wordle.reset()  // 게임 리셋 (정답 단어 무작위로 선택)
wordle.setAnswer(word)  // 정답 단어 지정
wordle.guess(word)  // 단어 추측 결과와 게임 정보(null, "win", "lose" 중에 하나)를 반환
wordle.onlyGuess(word)  // 단어 추측 결과 반환 (게임 진행은 안 되고 결과만 받음)
wordle.getHIstory()  // 이전 추측했던 단어와 결과들을 보여줌
wordle.getLeftTry()  // 남은 시도 횟수 반환

let wordleDict = new WordleDict()
wordleDict.historyToCond(history)  // rawHistory를 wordleDict에서 사용하는 조건 객체 형식으로 변환
// 조건에 맞는 단어 리스트 반환, extend가 true라면 wordle에서 정답으로 나올 수 없는 단어까지 확장해서 검색
// cond는 fixed, loose, exclude 속성을 가질 수 있음
// fixed는 주어진 인덱스에 들어가야 하는 글자가 정해진 조건
// loose는 해당 글자가 들어가야 하지만 주어진 인덱스에는 들어가지 않는 조건
// exclude는 해당 글자가 들어가지 않는 조건
// 예시 : {fixed : {1 : "a"}, loose : {b : [2, 3]}, exclude : ["c"]}
wordleDict.search(cond, extend) 

let wordleAI = new WordleAI()
// rawHistory를 입력으로 받아서 [추천 단어, 맞추기까지 남은 예상 횟수] 형태로 값을 반환
// order가 true라면 추천 단어 10개를 [[추천 단어, 예상 횟수], ... ] 형태로 값을 반환
wordleAI.inference(history, order)
wordleAI.guessWord(history, word)  // rawHistory 상태일 때 word로 추측한다면 맞추기까지 남은 예상 횟수 반환
```

## Example
You can find some simple examples in test.js and example.js
