///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from "sqlite3";
import fs from "fs";
const deleteDataSqlite = (searchObj) => {
  var start = new Date();

  const columns = Object.keys(searchObj);

  const personsList = [
    "id",
    "titleName",
    "firstName",
    "lastName",
    "gender",
    "national",
    "cell",
    "phone",
    "email",
    "picture",
    "dateOfBirth",
    "age",
  ];
  const accontsList = [
    "userName",
    "password",
    "registredDate",
    "registredYear",
  ];
  const addressesList = [
    "streetName",
    "streetNumber",
    "city",
    "state",
    "country",
    "postCode",
    "coordLatitude",
    "coordLongitude",
    "offsetTimeZone",
    "descriptionTimeZone",
  ];
  const documentsList = ["name", "value"];

  const personsObj = [];
  const accountsObj = [];
  const addressesObj = [];
  const documentsObj = [];

  //segregacja
  for (let i = 0; i < columns.length; i++) {
    if (personsList.includes(columns[i])) {
      const temp = isNaN(searchObj[columns[i]])
        ? '"' + searchObj[columns[i]] + '"'
        : searchObj[columns[i]];
      personsObj.push(`${columns[i]}=${temp}`);
    }
    if (accontsList.includes(columns[i])) {
      const temp = isNaN(searchObj[columns[i]])
        ? '"' + searchObj[columns[i]] + '"'
        : searchObj[columns[i]];
      accountsObj.push(`${columns[i]} =${temp}`);
    }
    if (addressesList.includes(columns[i])) {
      const temp = isNaN(searchObj[columns[i]])
        ? '"' + searchObj[columns[i]] + '"'
        : searchObj[columns[i]];
      addressesObj.push(`${columns[i]}=${temp}`);
    }
    if (documentsList.includes(columns[i])) {
      const temp = isNaN(searchObj[columns[i]])
        ? '"' + searchObj[columns[i]] + '"'
        : searchObj[columns[i]];
      documentsObj.push(`${columns[i]}=${temp}`);
    }
  }

  let personStr = "";
  let tmp = "";
  for (let i = 0; i < personsObj.length; i++) {
    tmp = personsObj[i].split("=");
    personStr +=
      i < personsObj.length - 1
        ? tmp[0] + "=" + tmp[1] + " AND "
        : tmp[0] + "=" + tmp[1] + "";
  }

  let accountStr = "";
  tmp = "";
  for (let i = 0; i < accountsObj.length; i++) {
    tmp = accountsObj[i].split("=");
    accountStr +=
      i < accountsObj.length - 1
        ? tmp[0] + "=" + tmp[1] + " AND "
        : tmp[0] + "=" + tmp[1] + "";
  }

  let addressStr = "";
  tmp = "";
  for (let i = 0; i < addressesObj.length; i++) {
    tmp = addressesObj[i].split("=");
    addressStr +=
      i < addressesObj.length - 1
        ? tmp[0] + "=" + tmp[1] + " AND "
        : tmp[0] + "=" + tmp[1] + "";
  }

  let documentStr = "";
  tmp = "";
  for (let i = 0; i < documentsObj.length; i++) {
    tmp = documentsObj[i].split("=");
    documentStr +=
      i < documentsObj.length - 1
        ? tmp[0] + "=" + tmp[1] + " AND "
        : tmp[0] + "=" + tmp[1] + "";
  }

  var db4 = new sqlite3.Database("db/sqlite3.db");
  db4.serialize(function () {
    if (personStr != "") console.log(personStr);
    db4.run(
      "DELETE P FROM persons P join addresses A ON A.id=P.adress_id WHERE " +
        personStr,
      () => {
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteSqlite.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
    if (accountStr != "")
      db4.run("DELETE FROM accounts WHERE " + accountStr, () => {
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteSqlite.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      });
    if (addressStr != "")
      db4.run("DELETE FROM addresses WHERE " + addressStr, () => {
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteSqlite.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      });
    if (documentStr != "")
      db4.run("DELETE FROM documents WHERE " + documentStr, () => {
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteSqlite.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      });

    // console.info("[SQLite] Czas usuwania danych: %dms", end);
    db4.close();
  });
};

//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from "nedb";

const deleteDataNedb = (obj) => {
  var start = new Date();

  const columns = Object.keys(obj);

  const personsList = [
    "_id",
    "titleName",
    "firstName",
    "lastName",
    "gender",
    "national",
    "cell",
    "phone",
    "email",
    "picture",
    "dateOfBirth",
    "age",
  ];
  const accontsList = [
    "userName",
    "password",
    "registredDate",
    "registredYear",
  ];
  const addressesList = [
    "streetName",
    "streetNumber",
    "city",
    "state",
    "country",
    "postCode",
    "coordLatitude",
    "coordLongitude",
    "offsetTimeZone",
    "descriptionTimeZone",
  ];
  const documentsList = ["name", "value"];

  const personsObj = [];
  const accountsObj = [];
  const addressesObj = [];
  const documentsObj = [];

  for (let i = 0; i < columns.length; i++) {
    if (personsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      personsObj.push(`"${columns[i]}": ${temp}`);
    }
    if (accontsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      accountsObj.push(`"${columns[i]}": ${temp}`);
    }
    if (addressesList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      addressesObj.push(`"${columns[i]}": ${temp}`);
    }
    if (documentsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      documentsObj.push(`"${columns[i]}": ${temp}`);
    }
  }

  let personStr = "";
  let addressStr = "";
  let accountStr = "";
  let documentStr = "";
  for (let i = 0; i < personsObj.length; i++) {
    i == personsObj.length - 1
      ? (personStr += personsObj[i])
      : (personStr += personsObj[i] + ",");
  }
  for (let i = 0; i < addressesObj.length; i++) {
    i == addressesObj.length - 1
      ? (addressStr += addressesObj[i])
      : (addressStr += addressesObj[i] + ",");
  }
  for (let i = 0; i < accountsObj.length; i++) {
    i == accountsObj.length - 1
      ? (accountStr += accountsObj[i])
      : (accountStr += accountsObj[i] + ",");
  }
  for (let i = 0; i < documentsObj.length; i++) {
    i == documentsObj.length - 1
      ? (documentStr += documentsObj[i])
      : (documentStr += documentsObj[i] + ",");
  }

  var db3 = {};

  db3.persons = new Datastore("db/nedb/persons.db");
  db3.accounts = new Datastore("db/nedb/accounts.db");
  db3.addresses = new Datastore("db/nedb/addresses.db");
  db3.documents = new Datastore("db/nedb/documents.db");

  db3.persons.loadDatabase();
  db3.accounts.loadDatabase();
  db3.addresses.loadDatabase();
  db3.documents.loadDatabase();

  if (personStr != "") {
    const PersonObject = JSON.parse(`{${personStr}}`);
    db3.persons.remove(
      PersonObject,
      { multi: true },
      function (err, numRemoved) {
        db3.persons.persistence.compactDatafile();
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteNeDB.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
  if (accountStr != "") {
    const AccountObject = JSON.parse(`{${accountStr}}`);
    db3.accounts.remove(
      AccountObject,
      { multi: true },
      function (err, numRemoved) {
        db3.accounts.persistence.compactDatafile();
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteNeDB.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
  if (addressStr != "") {
    const AddressObject = JSON.parse(`{${addressStr}}`);
    db3.addresses.remove(
      AddressObject,
      { multi: true },
      function (err, numRemoved) {
        db3.addresses.persistence.compactDatafile();
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteNeDB.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
  if (documentStr != "") {
    const DocumentObject = JSON.parse(`{${documentStr}}`);
    db3.documents.remove(
      DocumentObject,
      { multi: true },
      function (err, numRemoved) {
        db3.documents.persistence.compactDatafile();
        var end = new Date() - start;
        fs.writeFile(
          "./badania/deleteNeDB.txt",
          end + "\n",
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
};

///////////////////////////////////////////////// LowDB //////////////////////////////////////////

class Name {
  constructor(titleName, firstName, lastName) {
    if (titleName != undefined) this.title = titleName;
    if (firstName != undefined) this.first = firstName;
    if (lastName != undefined) this.last = lastName;
  }
}

class Street {
  constructor(streetName, streetNumber) {
    if (streetname != undefined) this.name = streetName;
    if (streetNumber != undefined) this.number = streetNumber;
  }
}

class Coordiantes {
  constructor(coordLatitude, coordLongitude) {
    if (coordLatitude != undefined) this.latitude = coordLatitude;
    if (coordLongitude != undefined) this.longitude = coordLongitude;
  }
}

class Timezone {
  constructor(offsetTimeZone, descriptionTimeZone) {
    if (offsetTimeZone != undefined) this.offset = offsetTimeZone;
    if (descriptionTimeZone != undefined)
      this.description = descriptionTimeZone;
  }
}

class Location {
  constructor(
    streetName,
    streetNumber,
    city,
    state,
    country,
    postCode,
    coordLatitude,
    coordLongitude,
    offsetTimeZone,
    descriptionTimeZone
  ) {
    if (streetName != undefined || streetNumber != undefined)
      this.street = new Street(streetName, streetNumber);
    if (city != undefined) this.city = city;
    if (state != undefined) this.state = state;
    if (country != undefined) this.country = country;
    if (postCode != undefined) this.postCode = postCode;
    if (coordLatitude != undefined || coordLongitude != undefined)
      this.coordinates = new Coordiantes(coordLatitude, coordLongitude);
    if (offsetTimeZone != undefined || descriptionTimeZone != undefined)
      this.timezone = new Timezone(offsetTimeZone, descriptionTimeZone);
  }
}

class Login {
  constructor(uuid, userName, password) {
    if (uuid != undefined) this.uuid = uuid;
    if (userName != undefined) this.userName = userName;
    if (password != undefined) this.password = password;
  }
}

class DateOfBirth {
  constructor(dateOfBirth, age) {
    if (dateOfBirth != undefined) this.date = dateOfBirth;
    if (age != undefined) this.age = age;
  }
}

class Registred {
  constructor(registredDate, registredYear) {
    if (registredDate != undefined) this.date = registredDate;
    if (registredYear != undefined) this.age = registredYear;
  }
}

class Id {
  constructor(documentName, documentValue) {
    if (documentName != undefined) this.name = documentName;
    if (documentValue != undefined) this.value = documentValue;
  }
}

class User {
  constructor(
    gender,
    titleName,
    firstName,
    lastName,
    streetName,
    streetNumber,
    city,
    state,
    country,
    postCode,
    coordLatitude,
    coordLongitude,
    offsetTimeZone,
    descriptionTimeZone,
    email,
    uuid,
    userName,
    password,
    dateOfBirth,
    age,
    registredDate,
    registredYear,
    phone,
    cell,
    documentName,
    documentValue,
    picture,
    national
  ) {
    if (gender != undefined) this.gender = gender;
    if (
      titleName != undefined ||
      firstName != undefined ||
      lastName != undefined
    )
      this.name = new Name(titleName, firstName, lastName);

    if (
      streetName != undefined ||
      streetNumber != undefined ||
      city != undefined ||
      state != undefined ||
      country != undefined ||
      postCode != undefined ||
      coordLatitude != undefined ||
      coordLongitude != undefined ||
      offsetTimeZone != undefined ||
      descriptionTimeZone != undefined
    )
      this.location = new Location(
        streetName,
        streetNumber,
        city,
        state,
        country,
        postCode,
        coordLatitude,
        coordLongitude,
        offsetTimeZone,
        descriptionTimeZone
      );
    if (email != undefined) this.email = email;
    if (uuid != undefined || userName != undefined || password != undefined)
      this.login = new Login(uuid, userName, password);
    if (dateOfBirth != undefined || age != undefined)
      this.dateOfBirth = new DateOfBirth(dateOfBirth, age);
    if (registredDate != undefined || registredYear != undefined)
      this.registred = new Registred(registredDate, registredYear);
    if (phone != undefined) this.phone = phone;
    if (cell != undefined) this.cell = cell;
    if (documentName != undefined || documentValue != undefined)
      this.id = new Id(documentName, documentValue);
    if (picture != undefined) this.picture = picture;
    if (national != undefined) this.national = national;
  }
}

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import lodash from "lodash";

async function deleteDataLowDB(obj) {
  var start = new Date();

  const SearchObj = new User(
    obj.gender,
    obj.titleName,
    obj.firstName,
    obj.lastName,
    obj.streetName,
    obj.streetNumber,
    obj.city,
    obj.state,
    obj.country,
    obj.postCode,
    obj.coordLatitude,
    obj.coordLongitude,
    obj.offsetTimeZone,
    obj.descriptionTimeZone,
    obj.email,
    obj.uuid,
    obj.userName,
    obj.password,
    obj.dateOfBirth,
    obj.age,
    obj.registredDate,
    obj.registredYear,
    obj.phone,
    obj.cell,
    obj.documentName,
    obj.documentValue,
    obj.picture,
    obj.national
  );

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, "db/lowdb.json");
  const adapter = new JSONFile(file);
  const db2 = new Low(adapter);

  await db2.read();
  db2.chain = lodash.chain(db2.data.users);
  db2.chain.remove(SearchObj).value();
  db2.write().then(() => {
    var end = new Date() - start;
    fs.writeFile(
      "./badania/deleteLowDB.txt",
      end + "\n",
      { flag: "a+" },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    // console.info("[LowDB] Czas usuwania danych: %dms", end);
  });
}

////////////////////////////////////////////// LevelDB /////////////////////////////////////////////

import levelup from "levelup";
import leveldown from "leveldown";

async function deleteDataLevelDB(obj) {
  var start = new Date();

  var db = levelup(leveldown("db/levelDB"));

  const id = [];
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
  const documentNames = [];
  const documentValues = [];
  const userNames = [];
  const passwords = [];
  const registredDates = [];
  const registredYears = [];

  let str;
  for await (const [key, value] of db.iterator()) {
    str = key + "";
    if (str.split(":")[0] == "age") {
      if (obj.age == value + "" || obj.age == undefined) ages.push(value + "");
      else ages.push(undefined);
    }
    if (str.split(":")[0] == "cell") {
      if (obj.cell == value + "" || obj.cell == undefined)
        cells.push(value + "");
      else cells.push(undefined);
    }
    if (str.split(":")[0] == "city") {
      if (obj.city == value + "" || obj.city == undefined)
        cities.push(value + "");
      else cities.push(undefined);
    }
    if (str.split(":")[0] == "coordLatitude") {
      if (obj.coordLatitude == value + "" || obj.coordLatitude == undefined)
        coordLatitudes.push(value + "");
      else coordLatitudes.push(undefined);
    }
    if (str.split(":")[0] == "coordLongitude") {
      if (obj.coordLongitude == value + "" || obj.coordLongitude == undefined)
        coordLongitudes.push(value + "");
      else coordLongitudes.push(undefined);
    }
    if (str.split(":")[0] == "country") {
      if (obj.country == value + "" || obj.country == undefined)
        countries.push(value + "");
      else countries.push(undefined);
    }
    if (str.split(":")[0] == "dateOfBirth") {
      if (obj.dateOfBirth == value + "" || obj.dateOfBirth == undefined)
        datesOfBirth.push(value + "");
      else datesOfBirth.push(undefined);
    }
    if (str.split(":")[0] == "descriptionTimeZone") {
      if (
        obj.descriptionTimeZone == value + "" ||
        obj.descriptionsTimeZone == undefined
      )
        descriptionsTimeZone.push(value + "");
      else descriptionsTimeZone.push(undefined);
    }
    if (str.split(":")[0] == "documentName") {
      if (obj.documentName == value + "" || obj.documentNames == undefined)
        documentNames.push(value + "");
      else documentNames.push(undefined);
    }
    if (str.split(":")[0] == "documentValue") {
      if (obj.documentValue == value + "" || obj.documentValue == undefined)
        documentValues.push(value + "");
      else documentValues.push(undefined);
    }
    if (str.split(":")[0] == "email") {
      if (obj.email == value + "" || obj.email == undefined)
        emails.push(value + "");
      else emails.push(undefined);
    }
    if (str.split(":")[0] == "firstName") {
      if (obj.firstName == value + "" || obj.firstName == undefined)
        firstNames.push(value + "");
      else firstNames.push(undefined);
    }
    if (str.split(":")[0] == "gender") {
      if (obj.gender == value + "" || obj.gender == undefined)
        genders.push(value + "");
      else genders.push(undefined);
    }
    if (str.split(":")[0] == "id") {
      if (obj.id == value + "" || obj.id == undefined) id.push(value + "");
      else id.push(undefined);
    }
    if (str.split(":")[0] == "lastName") {
      if (obj.lastName == value + "" || obj.lastName == undefined)
        lastNames.push(value + "");
      else lastNames.push(undefined);
    }
    if (str.split(":")[0] == "national") {
      if (obj.national == value + "" || obj.national == undefined)
        nationals.push(value + "");
      else nationals.push(undefined);
    }
    if (str.split(":")[0] == "offsetTimeZone") {
      if (obj.offsetTimeZone == value + "" || obj.offsetTimeZone == undefined)
        offsetTimeZones.push(value + "");
      else offsetTimeZones.push(undefined);
    }
    if (str.split(":")[0] == "password") {
      if (obj.password == value + "" || obj.password == undefined)
        passwords.push(value + "");
      else passwords.push(undefined);
    }
    if (str.split(":")[0] == "phone") {
      if (obj.phone == value + "" || obj.phone == undefined)
        phones.push(value + "");
      else phones.push(undefined);
    }
    if (str.split(":")[0] == "picture") {
      if (obj.picture == value + "" || obj.picture == undefined)
        pictures.push(value + "");
      else pictures.push(undefined);
    }
    if (str.split(":")[0] == "postCode") {
      if (obj.postCode == value + "" || obj.postCode == undefined)
        postCodes.push(value + "");
      else postCodes.push(undefined);
    }
    if (str.split(":")[0] == "registredDate") {
      if (obj.registredDate == value + "" || obj.registredDate == undefined)
        registredDates.push(value + "");
      else registredDates.push(undefined);
    }
    if (str.split(":")[0] == "registredYear") {
      if (obj.registredYear == value + "" || obj.registredYear == undefined)
        registredYears.push(value + "");
      else registredYears.push(undefined);
    }
    if (str.split(":")[0] == "state") {
      if (obj.state == value + "" || obj.state == undefined)
        states.push(value + "");
      else states.push(undefined);
    }
    if (str.split(":")[0] == "streetName") {
      if (obj.streetName == value + "" || obj.streetName == undefined)
        streetNames.push(value + "");
      else streetNames.push(undefined);
    }
    if (str.split(":")[0] == "streetNumber") {
      if (obj.streetNumber == value + "" || obj.streetNumber == undefined)
        streetNumbers.push(value + "");
      else streetNumbers.push(undefined);
    }
    if (str.split(":")[0] == "titleName") {
      if (obj.titleName == value + "" || obj.titleName == undefined)
        titleNames.push(value + "");
      else titleNames.push(undefined);
    }
    if (str.split(":")[0] == "userName") {
      if (obj.userName == value + "" || obj.userName == undefined)
        userNames.push(value + "");
      else userNames.push(undefined);
    }
  }

  for (let i = 0; i < id.length; i++) {
    if (
      id[i] != undefined &&
      titleNames[i] != undefined &&
      firstNames[i] != undefined &&
      lastNames[i] != undefined &&
      genders[i] != undefined &&
      streetNames[i] != undefined &&
      streetNumbers[i] != undefined &&
      cities[i] != undefined &&
      states[i] != undefined &&
      countries[i] != undefined &&
      postCodes[i] != undefined &&
      coordLatitudes[i] != undefined &&
      coordLongitudes[i] != undefined &&
      offsetTimeZones[i] != undefined &&
      descriptionsTimeZone[i] != undefined &&
      nationals[i] != undefined &&
      cells[i] != undefined &&
      phones[i] != undefined &&
      emails[i] != undefined &&
      pictures[i] != undefined &&
      datesOfBirth[i] != undefined &&
      ages[i] != undefined &&
      documentNames[i] != undefined &&
      documentValues[i] != undefined &&
      userNames[i] != undefined &&
      passwords[i] != undefined &&
      registredDates[i] != undefined &&
      registredYears[i] != undefined
    ) {
      const ops = [
        { type: "del", key: `id:${id[i]}` },
        { type: "del", key: `titleName:${id[i]}` },
        { type: "del", key: `firstName:${id[i]}` },
        { type: "del", key: `lastName:${id[i]}` },
        { type: "del", key: `gender:${id[i]}` },
        { type: "del", key: `streetName:${id[i]}` },
        { type: "del", key: `streetNumber:${id[i]}` },
        { type: "del", key: `city:${id[i]}` },
        { type: "del", key: `state:${id[i]}` },
        { type: "del", key: `country:${id[i]}` },
        { type: "del", key: `postCode:${id[i]}` },
        { type: "del", key: `coordLatitude:${id[i]}` },
        { type: "del", key: `coordLongitude:${id[i]}` },
        { type: "del", key: `offsetTimeZone:${id[i]}` },
        { type: "del", key: `descriptionTimeZone:${id[i]}` },
        { type: "del", key: `national:${id[i]}` },
        { type: "del", key: `cell:${id[i]}` },
        { type: "del", key: `phone:${id[i]}` },
        { type: "del", key: `email:${id[i]}` },
        { type: "del", key: `picture:${id[i]}` },
        { type: "del", key: `dateOfBirth:${id[i]}` },
        { type: "del", key: `age:${id[i]}` },
        { type: "del", key: `documentName:${id[i]}` },
        { type: "del", key: `documentValue:${id[i]}` },
        { type: "del", key: `userName:${id[i]}` },
        { type: "del", key: `password:${id[i]}` },
        { type: "del", key: `registredDate:${id[i]}` },
        { type: "del", key: `registredYear:${id[i]}` },
      ];

      db.batch(ops, function (err) {
        if (err) return console.log("Ooops!", err);
      });
    }
  }

  var end = new Date() - start;
  fs.writeFile(
    "./badania/deleteLevelDB.txt",
    end + "\n",
    { flag: "a+" },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  // console.info("[LevelDB] Czas usuwania danych: %dms", end);
}

deleteDataSqlite({ gender: "female" });
// deleteDataNedb({ gender: "male", titleName: "Mr" });
// deleteDataLowDB({ gender: "male", titleName: "Mr" });
// deleteDataLevelDB({ gender: "male", titleName: "Mr" });
