# Cloud_project

a programing course project to create a web page to show in real time, the location and data of the current flights from and to Ben Gurion airport TLV.
The project is based on MicroServices design.

## Requirement
Docker:
* Redis:latest
* Mongodb:latest
* MYSQL:5

Python:
* Sklearn
* Pandas
* Pickle

Node.js: run npm install

## Running

start system-c.js, system-a.js, cons.js, app.js

## Troubleshoot
1. Error: connect ENOENT /var/run/mysqld/mysqld.sock
solution - make sure that you fill the port with 3306, and the address is 0.0.0.0

2. Image we are running on its mysql:5 (not latest)

3. npm clean-install
