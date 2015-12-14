'use strict';

const fs = require('fs');
const converter = require('./index.js');

const configFile = process.argv.length == 3 ? process.argv[2] : 'configuration.default.json';

console.log('Reading configuration from ', configFile);

let config;
try {
    config = JSON.parse(fs.readFileSync(configFile));
}
catch(err) {
    console.error('Error while reading config file from ', configFile);
    process.exit(1);
}


if( ! config.originalProjection ) {
    console.error('Bad configuration, miss <defaultOriginalProjection>');
    process.exit(3);
}
if( ! config.finalProjection ) {
    console.error('Bad configuration, miss <defaultFinalProjection>');
    process.exit(3);
}
if( ! config.inputPath ) {
    console.error('Bad configuration, miss <inputPath>');
    process.exit(3);
}
if( ! config.outputPath ) {
    console.error('Bad configuration, miss <outputPath>');
    process.exit(3);
}
if( ! config.lonCol ) {
    console.error('Bad configuration, miss <lonCol>');
    process.exit(3);
}
if( ! config.latCol ) {
    console.error('Bad configuration, miss <latCol>');
    process.exit(3);
}

try {

    console.log('Reading from ', config.inputPath);
    const inputData = fs.readFileSync(config.inputPath);

    console.log('Converting...');
    converter.transformCSV(inputData, config.latCol, config.lonCol, config.originalProjection, config.finalProjection)
        .then((convertedCSV) => {

            try {
                //console.log(convertedCSV);
                console.log('Writing reuslt to', config.outputPath);
                fs.writeFileSync(config.outputPath, convertedCSV);
            }
            catch(err) {
                console.error('Error writing data to ', config.outputPath, ': ', err);
            }
        })
        .catch((err) => {
            console.error('Error processing data: ', err);
            process.exit(2);
        });

}
catch(err) {
    console.error('Error reading data form ', config.inputPath, ': ', err);
}