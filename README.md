# Open Inventory

> A liver version of the open inventory system server can be found in <https://open-inventory-system.herokuapp.com/>

![Open Inventory](https://github.com/openinventoryorg/backend-api/raw/master/assets/full_logo.png)

## Setup

### Database Setup

#### Postgres Setup

Install [postgresql](https://www.postgresql.org/) in the local machine and setup correctly. Then use following command to login to the `psql` shell.

```bash
psql -U postgres
```

 Then enter below commands in order to create the role from which the server will access the database.

```sql
CREATE ROLE openinventoryuser WITH LOGIN PASSWORD 'password';
CREATE DATABASE openinventorydatabase;
GRANT ALL PRIVILEGES ON DATABASE openinventorydatabase TO openinventoryuser;
\q
```

Then you should be able to login to `psql` as `openinventoryuser`.

```bash
psql -U openinventoryuser openinventoryuser
```

### Node.js setup

Install NodeJS. This program was tested with NodeJS 12.16.1 LTS.

* [node.js v12.16.1 erbium](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/get-npm)

On arch based systems,

```bash
sudo pacman -S nodejs-lts-erbium
sudo pacman -S npm
```

 After that `cd` to the project directory and run `npm install`.

### Run Project

```bash
cd directory/project
npm install
```

Then create a `.env` file in the project directory with following content.
You have to set the database user/password/secret as you wish.

```text
PORT=8000
NODE_ENV=development
DATABASE_URL=postgres://smartlab:roJaGdNZgqNpLQcq@localhost:5432/smartlab
SALT_ROUNDS=10
JWT_SECRET=helloguys
LOG_LEVEL=info
MAIL_SENDER=openinventorysystem@gmail.com
ETHEREAL_USERNAME=maynard64@ethereal.email
ETHEREAL_PASSWORD=E6NyGYDJCgrCr9QKYN
GMAIL_USERNAME=openinventorysystem@gmail.com
GMAIL_PASSWORD=jHm33JhqdhWKuknB
SITE_API=http://localhost:3000/register
DB_INIT=false
ADMIN_EMAIL=admin@admin.com
```

Then use `nodemon` or `node` to serve the pages.

```bash
npm run dev # to run using nodemon
npm start   # otherwise
```

Now visit <http://localhost:3000/> and confirm that site is running.

After initial run, set DB_INIT as false in the `.env` file.
