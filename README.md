# SmartLab

## Guide 👨‍💻

### Database setup

Install [postgresql](https://www.postgresql.org/) in the local machine and setup correctly. Use following command to login to the `psql` shell.

```bash
psql -U postgres
```

 Then enter below commands. 

```sql
CREATE ROLE smartlab WITH LOGIN PASSWORD 'password';
CREATE DATABASE smartlab;
GRANT ALL PRIVILEGES ON DATABASE smartlab TO smartlab;
\q
```

Then you should be able to login to `psql` as `smartlab`.

```bash
psql -U smartlab smartlab
```

### Node.js setup

Install 

* [node.js v12.16.1 erbium](https://nodejs.org/en/) 
* [npm](https://www.npmjs.com/get-npm)
* [nodemon](https://www.npmjs.com/package/nodemon)

```bash
sudo pacman -S nodejs-lts-erbium
sudo pacman -S npm
npm install -g nodemon
```

 After that `cd` to the project directory and run `npm install`.

```bash
cd directory/project
npm install
```

Then create a `.env` file in the root with following content.
You may change database user/password/secret as you wish.

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://smartlab:password@localhost:5432/smartlab
JWT_SECRET=thisisjwtsecret
LOG_LEVEL=info
```

Then use `nodemon` or `node` to serve the pages.

```bash
nodemon start # If nodemon is installed
node index.js # otherwise
```

Now visit http://localhost:3000/ and confirm that site is running.