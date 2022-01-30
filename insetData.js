import fetch from 'node-fetch';

import sqlite3 from 'sqlite3';

const usersCount = 1000;

const response = await fetch(`https://randomuser.me/api/?results=${usersCount}&nat=US,ES,FR,NL,GB,FI,IE,AU,CH,DK,NO`);
const data = await response.json();
const results = data.results;


// persons data
const titleNames = [];
const firstNames = [];
const lastNames = [];
const genders = [];
const nationals = [];
const cells = [];
const phones = [];
const emails = [];
const pictures = [];
const datesOfBirth = [];
const ages = [];

for(let i=0; i<results.length; i++){
    titleNames.push(results[i].name.title);
    firstNames.push(results[i].name.first);
    lastNames.push(results[i].name.last);
    genders.push(results[i].gender);
    nationals.push(results[i].nat);
    cells.push(results[i].cell);
    phones.push(results[i].phone);
    emails.push(results[i].email);
    pictures.push(results[i].picture.medium);
    datesOfBirth.push(results[i].dob.date);
    ages.push(results[i].dob.age);
}


// addresses data
const streetNames = [];
const streetNumbers = [];
const cities = [];
const states = [];
const countries = [];
const postCodes = [];
const coordLatitudes = [];
const coordLongitudes = [];
const offsetTimeZones = [];
const descriptionsTimeZone = [];

for(let i=0; i<results.length; i++){
    streetNames.push(results[i].location.street.name);
    streetNumbers.push(results[i].location.street.number);
    cities.push(results[i].location.city);
    states.push(results[i].location.state);
    countries.push(results[i].location.country);
    postCodes.push(results[i].location.postcode);
    coordLatitudes.push(results[i].location.coordinates.latitude);
    coordLongitudes.push(results[i].location.coordinates.longitude);
    offsetTimeZones.push(results[i].location.timezone.offset);
    descriptionsTimeZone.push(results[i].location.timezone.description);
}


// documents data
const documentNames = [];
const documentValues = [];

for(let i=0; i<results.length; i++){
    documentNames.push(results[i].id.name);
    documentValues.push(results[i].id.value);
}

// accounts data
const userNames = [];
const passwords = [];
const registredDates = [];
const registredYears = [];

for(let i=0; i<results.length; i++){
    userNames.push(results[i].login.username);
    passwords.push(results[i].login.password);
    registredDates.push(results[i].registered.date);
    registredYears.push(results[i].registered.age);
}


const uuids = [];

for(let i=0; i<results.length; i++)
    uuids[i] = results[i].login.uuid;


// SQLITE INSERT ROWS

var db4;
let globalStartSqlite;
let addressesId = [];
let personsId = [];

const addAccounts = () => {
    var start = new Date()
    var stmt = db4.prepare("INSERT INTO accounts(person_id, username, password, registreddate, registredyears) VALUES (?, ?, ?, ?, ?)");
    for (let i = 0; i < results.length; i++) {
        stmt.run(personsId[i], userNames[i], passwords[i], registredDates[i], registredYears[i]);
    }
    stmt.finalize(()=>{
        var end = new Date() - start;
        console.info('[SQLite] Czas instertowania do tabeli Accounts: %dms', end);
        var globalEnd = new Date() - globalStartSqlite;
        console.info('[Sqlite] Łączny czas wstawiania danych: %dms', globalEnd);
        db4.close(); 
    });
}


const addDocuments = () => {
    var start = new Date()
    var stmt = db4.prepare("INSERT INTO documents(person_id, name, value) VALUES (?, ?, ?)");
    for (let i = 0; i < results.length; i++) {
        stmt.run(personsId[i], documentNames[i], documentValues[i]);
    }
    stmt.finalize(()=>{
        var end = new Date() - start;
        console.info('[SQLite] Czas instertowania do tabeli Documents: %dms', end);
        addAccounts();
    });
}

const getIdperson = ()=>{
    db4.each(`select id from persons order by id desc limit ${results.length}`, function(err, row) {
        personsId.push(row.id);
    }, function(){
        personsId.reverse();  
        addDocuments();
    }); 
}

// insert to persons table
const addPersons = ()=> { 
    var start = new Date()
    var stmt = db4.prepare("INSERT INTO persons(titlename, firstName, lastName, gender, adress_id, national, cell, phone, email, picture, dateofbirth, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (let i = 0; i < results.length; i++) {
        stmt.run(titleNames[i], firstNames[i], lastNames[i], genders[i], addressesId[i], nationals[i], cells[i], phones[i], emails[i], pictures[i], datesOfBirth[i], ages[i]);
    }
    stmt.finalize(()=>{
        var end = new Date() - start;
        console.info('[SQLite] Czas instertowania do tabeli Persons: %dms', end);
        getIdperson();
    });
}


// get new id from adresses
const getIdAddress = ()=>{
    db4.each(`select id from addresses order by id desc limit ${results.length}`, function(err, row) {
        addressesId.push(row.id);
    }, function(){
        addressesId.reverse();
        addPersons();
    }); 
}

// insert to addresses table
const insertDataToSqlite = () => {
    globalStartSqlite = new Date();
    var start = new Date()
    db4 = new sqlite3.Database('db/sqlite3.db');
    var stmt = db4.prepare("INSERT INTO addresses(streetname, streetnumber, city, state, country, postcode, coordlatitude, coordlongitude, offsettimezone, descriptiontimezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (let i = 0; i < results.length; i++) {
        stmt.run(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]);
    }
    stmt.finalize(()=>{
        var end = new Date() - start;
        console.info('[SQLite] Czas instertowania do tabeli Addresses: %dms', end);
        getIdAddress();
    });
}





 
// NEDB insert rows
class Address{
    constructor(streetName, streetNumber, city, state, country, postCode, 
        coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone){
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postCode = postCode;
        this.coordLatitude = coordLatitude;
        this.coordLongitude = coordLongitude;
        this.offsetTimeZone = offsetTimeZone;
        this.descriptionTimeZone = descriptionTimeZone;
    }
}

class Person {
    constructor(titleName, firstName, lastName, gender, adress_id, national, cell, phone, email, picture, dateOfBirth, age){
        this.titleName = titleName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.adress_id  = adress_id;
        this.national = national;
        this.cell = cell;
        this.phone = phone;
        this.email = email;
        this.picture = picture;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
    }
}

class Document{
    constructor(person_id, name, value){
        this.person_id = person_id;
        this.name = name;
        this.value = value;
    }
}

class Account{
    constructor(person_id, userName, password, registredDate, registredYear){
        this.person_id = person_id;
        this.userName = userName;
        this.password = password;
        this.registredDate = registredDate;
        this.registredYear = registredYear;
    }
}

import Datastore from 'nedb';

let globalStart;
let db3;
const addressesIdMongo = [];
const personsIdMongo = [];

const addAccountsMongo = () => {
    var start = new Date()

    // const accounts = [];
    // for(let i=0; i<results.length; i++)
    //     accounts.push(new Account(personsIdMongo[i], userNames[i], passwords[i], registredDates[i], registredYears[i]));
    for(let i=0; i<results.length; i++)
        db3.accounts.insert(new Account(personsIdMongo[i], userNames[i], passwords[i], registredDates[i], registredYears[i]), function(err, newDocs){
                if(i==results.length-1){
                    var end = new Date() - start;
                    console.info('[Nedb] Czas wstawiania danych do tabeli Accounts: %dms', end);

                    var globalEnd = new Date() - globalStart;
                    console.info('[Nedb] Łączny czas wstawiania danych: %dms', globalEnd);
                }
            });
}

const addDocumentsMongo = () => {
        var start = new Date()

        // const documents = [];
        // for(let i=0; i<results.length; i++)
        //     documents.push(new Document(personsIdMongo[i], documentNames[i], documentValues[i]))

        for(let i=0; i<results.length; i++)
            db3.documents.insert(new Document(personsIdMongo[i], documentNames[i], documentValues[i]), function(err, newDocs){
                if(i==results.length-1){
                    var end = new Date() - start;
                    console.info('[Nedb] Czas wstawiania danych do tabeli Documents: %dms', end); 
                    addAccountsMongo();
                }
            });
        
}

const addPersonsMongo = () => {   
    var start = new Date()

    // const persons = [];
    // for(let i=0; i<results.length; i++)
    //     persons.push(new Person(titleNames[i], firstNames[i], lastNames[i], genders[i], addressesIdMongo[i], nationals[i], cells[i], phones[i], emails[i], pictures[i], datesOfBirth[i], ages[i]));
    
    for(let i=0; i<results.length; i++)
        db3.persons.insert(new Person(titleNames[i], firstNames[i], lastNames[i], genders[i], addressesIdMongo[i], nationals[i], cells[i], phones[i], emails[i], pictures[i], datesOfBirth[i], ages[i]), function(err, newDocs){
            personsIdMongo.push(newDocs._id);
            if(i==results.length-1){
                var end = new Date() - start;
                console.info('[Nedb] Czas wstawiania danych do tabeli Persons: %dms', end);  
                addDocumentsMongo();
            }
        });
}

const insertDataToNedb = () => {
    globalStart = new Date();

    db3 = {};

    db3.persons = new Datastore('db/nedb/persons.db');
    db3.accounts = new Datastore('db/nedb/accounts.db');
    db3.addresses = new Datastore('db/nedb/addresses.db');
    db3.documents = new Datastore('db/nedb/documents.db');

    db3.persons.loadDatabase();
    db3.accounts.loadDatabase();
    db3.addresses.loadDatabase();
    db3.documents.loadDatabase();


    var start = new Date()
    for(let i = 0; i < results.length; i++)
        db3.addresses.insert(new Address(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]), function(err, newDocs){
            addressesIdMongo.push(newDocs._id);
            if(i==results.length-1){
                var end = new Date() - start;
                console.info('[Nedb] Czas wstawiania danych do tabeli Adresses: %dms', end);
                addPersonsMongo();
            }   
    });
}



///////////////////////////////////////////////// LowDB //////////////////////////////////////////////////////////

class Name{
    constructor(titleName, firstName, lastName){
        this.title = titleName;
        this.first = firstName;
        this.last = lastName;
    } 
}

class Street{
    constructor(streetName, streetNumber){
        this.name = streetName;
        this.number = streetNumber;
    }
}

class Coordiantes{
    constructor(coordLatitude, coordLongitude){
        this.latitude = coordLatitude;
        this.longitude = coordLongitude;
    }
}

class Timezone{
    constructor(offsetTimeZone, descriptionTimeZone){
        this.offset = offsetTimeZone;
        this.description = descriptionTimeZone;
    }
}

class Location{
    constructor(streetName, streetNumber, city, state, country, postCode, coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone)
    {
        this.street = new Street(streetName, streetNumber);
        this.city = city;
        this.state = state;
        this.country = country;
        this.postCode = postCode;
        this.coordinates = new Coordiantes(coordLatitude, coordLongitude);
        this.timezone = new Timezone(offsetTimeZone, descriptionTimeZone);
    }
}

class Login{
    constructor(uuid, userName, password){
        this.uuid = uuid;
        this.userName = userName;
        this.password = password;
    }
}

class DateOfBirth{
    constructor(dateOfBirth, age){
        this.date = dateOfBirth;
        this.age = age;
    }
}

class Registred{
    constructor(registredDate, registredYear){
        this.date = registredDate;
        this.age = registredYear;
    }
}

class Id{
    constructor(documentName, documentValue){
        this.name = documentName;
        this.value = documentValue;
    }
}

class User{
    constructor(gender, titleName, firstName, lastName, streetName, streetNumber, city, state, country, 
        postCode, coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone,
        email, uuid, userName, password, dateOfBirth, age, registredDate, registredYear, phone, cell, 
        documentName, documentValue, picture, national){
        this.gender = gender;
        this.name = new Name(titleName, firstName, lastName);
        this.location = new Location(streetName, streetNumber, city, state, country, postCode, 
            coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone);
        this.email = email;
        this.login = new Login(uuid, userName, password);
        this.dateOfBirth = new DateOfBirth(dateOfBirth , age);
        this.registred = new Registred(registredDate, registredYear);
        this.phone = phone;
        this.cell = cell;
        this.id = new Id(documentName, documentValue);
        this.picture = picture;
        this.national = national;
    }
}


import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

async function insertDataToLowDB(){
    var start = new Date();

    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Use JSON file for storage
    const file = join(__dirname, 'db/lowdb.json')
    const adapter = new JSONFile(file)
    const db2 = new Low(adapter)

    await db2.read();

    db2.data ||= { users: [] };

    for(let i = 0; i<results.length; i++)
        db2.data.users.push(new User(genders[i], titleNames[i], firstNames[i], lastNames[i], streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i],  coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i], emails[i], uuids[i], userNames[i], passwords[i], datesOfBirth[i], ages[i], registredDates[i], registredYears[i], phones[i], cells[i], documentNames[i], documentValues[i], pictures[i], nationals[i]));

    db2.write();

    var end = new Date() - start;
    console.info('[LowDB] Czas wstawiania danych: %dms', end); 
}



/////////////////////////////////////// LevelDB ///////////////////////////////////////////////

import levelup from 'levelup';
import leveldown  from 'leveldown';

const insertDataToLevelDB = () => {
    var start = new Date();

    var db = levelup(leveldown('db/levelDB'))
    for(let i = 0 ; i<results.length; i++){
        db.put(`titleName:${uuids[i]}`, titleNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`firstName:${uuids[i]}`, firstNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`lastName:${uuids[i]}`, lastNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`gender:${uuids[i]}`, genders[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`national:${uuids[i]}`, nationals[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`cell:${uuids[i]}`, cells[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`phone:${uuids[i]}`, phones[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`email:${uuids[i]}`, emails[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`picture:${uuids[i]}`, pictures[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`dateOfBirth:${uuids[i]}`, datesOfBirth[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`age:${uuids[i]}`, ages[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`streetName:${uuids[i]}`, streetNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`streetNumber:${uuids[i]}`, streetNumbers[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`city:${uuids[i]}`, cities[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`state:${uuids[i]}`, states[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`country:${uuids[i]}`, countries[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`postCode:${uuids[i]}`, postCodes[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`coordLatitude:${uuids[i]}`, coordLatitudes[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`coordLongitude:${uuids[i]}`, coordLongitudes[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`offsetTimeZone:${uuids[i]}`, offsetTimeZones[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`descriptionTimeZone:${uuids[i]}`, descriptionsTimeZone[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`documentName:${uuids[i]}`, documentNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`documentValue:${uuids[i]}`, documentValues[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`userName:${uuids[i]}`, userNames[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`password:${uuids[i]}`, passwords[i], function (err) {
            if (err) return console.log('Ooops!', err)
        }) 
        db.put(`registredDate:${uuids[i]}`, registredDates[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
        db.put(`registredYear:${uuids[i]}`, registredYears[i], function (err) {
            if (err) return console.log('Ooops!', err)
        })
    
    }

    var end = new Date() - start;
    console.info('[LevelDB] Czas wstawiania danych: %dms', end); 
}




insertDataToSqlite();
insertDataToNedb();
insertDataToLowDB();
insertDataToLevelDB();