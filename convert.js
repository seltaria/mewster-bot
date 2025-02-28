import fs from 'fs';

const data = fs.readFileSync('./assets/russian-nouns.txt').toString().split('\n').filter(word => word.match(/.+/i));

const res = data.reduce((acc, word) => {
    acc[word[0]] = [...(acc[word[0]] || []), word]
    return acc
}, {})

fs.writeFileSync('./assets/russian-nouns.json', JSON.stringify(res))
