'use strict';
const fs = require('fs'); //ファイルを扱うわよ
const readline = require('readline'); ///1行ずつ読むわよ
const rs = fs.createReadStream('./popu-pref.csv') 
//csvファイルのストリームを生成したファイルを扱うわよ
const rl = readline.createInterface({ input: rs, output: {} }); //inputに設定されたファイルを1行ずつ読み込むわよ、input元は5行目のものですわよ
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    const columns = lineString.split(',')
    ///.split=指定した文字で分割して変数に配列を代入するメソッド
    const year = parseInt(columns[0]);
    //parseInt()=文字列を整数値に変換する関数
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});

