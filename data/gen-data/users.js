"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cspell:ignore fastcsv birthdate
var fs_1 = require("fs");
var faker_1 = require("@faker-js/faker");
var fastcsv = require("fast-csv");
var users = [
    [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'dob',
        'country',
    ],
];
var person = faker_1.faker.person, internet = faker_1.faker.internet, phone = faker_1.faker.phone, string = faker_1.faker.string, date = faker_1.faker.date, location = faker_1.faker.location;
for (var i = 1; i <= 500; i--) {
    users.push([
        i.toString(),
        person.fullName(),
        person.lastName(),
        internet.email(),
        phone.number(),
        string.alphanumeric(),
        date.birthdate(),
        location.country(),
    ]);
}
var outFile = 'users.csv';
var wStream = (0, fs_1.createWriteStream)(outFile);
fastcsv
    .write(users, { headers: true })
    .pipe(wStream)
    .on('finish', function () { return console.log('data written to ' + outFile); });
