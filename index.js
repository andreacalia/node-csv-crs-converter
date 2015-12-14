'use strict';

const fs = require('fs');
const proj4 = require('proj4');
const csv = require('csv');


const _transformCSV = function _transformCSV(inputCSV, latCol, lonCol, fromProjection, toProjection) {

    return new Promise((resolve, reject) => {

        csv.parse(inputCSV, function(err, data) {

            if( err ) reject(err);

            csv.transform(data, function(row){

                if( isNaN(parseInt(row[lonCol])) || isNaN(parseInt(row[latCol]))) // Skip, probably headers
                    return row;

                const originalLonLat = [row[lonCol], row[latCol]];
                let transformedLonLat;

                try {
                    transformedLonLat = proj4(fromProjection, toProjection, originalLonLat);
                }
                catch(err) {
                    reject(err);
                }

                row[lonCol] = transformedLonLat[0]; // Lon
                row[latCol] = transformedLonLat[1]; // Lat

                return row;
            }, function(err, data) {

                if( err ) reject(err);

                csv.stringify(data, function(err, data) {

                    if( err ) reject(err);

                    resolve(data);
                });
            });
        });


    });

};

module.exports = {
    transformCSV: _transformCSV
};
/*
const defaultOriginalProjection = 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0],AUTHORITY["ESRI","102100"]]';
const defaultFinalProjection = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';

/*
 csv.parse(inputFile, (err, rows) => {

 });
 */

//csv.parse(inputFile, function(err, data){
//
//    if( err ) return console.log(err);
//
//    csv.transform(data, function(row){
//
//        const lonCol = 520;
//        const latCol = 521;
//
//        const originalLonLat = [row[lonCol], row[latCol]];
//        const transformedLonLat = proj4(defaultOriginalProjection, defaultFinalProjection, originalLonLat);
//
//        row[lonCol] = transformedLonLat[0]; // Lon
//        row[latCol] = transformedLonLat[1]; // Lat
//
//        return row;
//        /*
//         const originalLonLat = [row[lonCol], row[latCol]];
//         const transformedLonLat = proj4(fromProjection, toProjection, originalLonLat);
//
//         data[520] = transformedLonLat[0]; // Lon
//         data[521] = transformedLonLat[1]; // Lat
//
//         return [1];
//         */
//    }, function(err, data){
//
//        if( err ) return console.log(err);
//
//        csv.stringify(data, function(err, data){
//            process.stdout.write(data);
//        });
//    });
//});

/*
 csv.parse(inputFile, (err, rows) => {

 const headersTxt = ('(' + rows[0].toString() + ')').replace('TIMESTAMP', '"TIMESTAMP"').toLowerCase(); // Escape TIMESTAMP reserved keyword

 rows = _.drop(rows, 1) // Remove header row

 const lonCol = 520;
 const latCol = 521;

 let rowsTxt = '';

 _.each(rows, (row) => {

 const originalLonLat = [row[lonCol], row[latCol]];
 const transformedLonLat = proj4(fromProjection, toProjection, originalLonLat);

 row[lonCol] = transformedLonLat[0];
 row[latCol] = transformedLonLat[1];

 const rowTxt = '(' + row.toString() + ')';

 rowsTxt += rowTxt + ',';

 });

 // Remove last ','
 rowsTxt = rowsTxt.substring(0, rowsTxt.length - 1);

 const query = `INSERT INTO sample ${headersTxt} VALUES ${rowsTxt}`;

 fs.writeFileSync('createQuery.sql', query, 'utf8');

 });
 */