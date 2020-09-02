const fs = require('fs');
const readline = require('n-readlines');
const mongoose = require('mongoose');
const { Haiku } = require('./backend/models/haikuModel');
const config = require('config');
let haikuCount = 0;
let lineCount = 0;
let title = '';
let line1, line2, line3 = '';
let myDate = new Date("2012-01-01T00:00:00.000+05:00");
let haiku;
const author = "5f48036342d0d57c40433942";

const writeStream = fs.createWriteStream('C:/Users/Paul/Documents/HaikuProject.json');
writeStream.write("{[");

const liner = new readline('C:/Users/Paul/Documents/HaikuProject.txt');
let line, strLine;
const db = config.get("mongoURI");

mongoose
    .connect(db, {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log(`Connect to Mongo at ${db}`)

        while (line = liner.next()) {
            strLine = line.toString('utf-8').trim();
            if (strLine.includes('/')) {
                console.log('Title = ' + title.toString() + ',Date = ' + myDate.toDateString());
                if (haikuCount > 0) {
                    try {
                        writeStream.write("{");
                        writeStream.write(`\ttitle: \"${title}\",\n`);
                        writeStream.write('\tauthor: \"Paul\",\n');
                        writeStream.write(`\tline1: \"${line1}\t",\n`);
                        writeStream.write(`\tline2: \"${line2}\t",\n`);
                        writeStream.write(`\tline3: \"${line3}\t",\n`);
                        writeStream.write('\tcanShare: true,\n');
                        writeStream.write('\tcanScramble: true,\n');
                        writeStream.write(`\tdateAdded: \"${myDate.toISOString()}\",\n`);
                        writeStream.write('\tlikes: 1,\n');
                        writeStream.write("},\n");
                        haiku = new Haiku({
                            title,
                            author,
                            line1,
                            line2,
                            line3,
                            canScramble: true,
                            isScramble: false,
                            likers: author,
                            visibleTo: 'public',
                            dateAdded: myDate.toISOString()
                        });
                        haiku.save()
                            .then(console.log('Saved ' + title + ' for ' + myDate.toDateString()))
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

                title = strLine;
                haikuCount++;
                lineCount = 0;
                myDate.setDate(myDate.getDate() + 1);
            }
            else {
                if (lineCount == 0) line1 = strLine;
                if (lineCount == 1) line2 = strLine;
                if (lineCount == 2) line3 = strLine;
                lineCount++;
            }
        }

        haiku = new Haiku({
            title,
            author,
            line1,
            line2,
            line3,
            canScramble: true,
            isScramble: false,
            likers: author,
            visibleTo: 'public',
            dateAdded: myDate.toISOString()
        });
        haiku.save()
            .then(() => console.log(`Saved ${title} for ${myDate.toDateString()}`))

        writeStream.end("]}");
    })
    .catch((err) => console.error("Could not connect to MongoDB: ", err));




