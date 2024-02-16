const { Haiku } = require('../models/haikuModel');
let myDate = new Date("2012-01-01T00:00:00.000+05:00");
let haiku;
const jsonSamples = require('../../static/HaikuProjectSamples.json')

const loadFromFile = (authorId) => {

    jsonSamples.haikus.forEach(sampleHaiku => {
            haiku = new Haiku({
            title: sampleHaiku.title,
            author: authorId,
            line1: sampleHaiku.line1,
            line2: sampleHaiku.line2,
            line3: sampleHaiku.line3,
            canScramble: true,
            isScramble: false,
            likers: authorId,
            visibleTo: 'public',
            dateAdded: myDate.toISOString()
        });
        haiku.save()
            .then(console.log('Saved ' + haiku.title + ' for ' + myDate.toDateString()));
    })

}

module.exports = loadFromFile


        

    





