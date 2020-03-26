# Open Inventory

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
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://openinventoryuser:password@localhost:5432/openinventorydatabase
SALT_ROUNDS=10
JWT_SECRET=gpV3XgVPf3Nq26CRwtmVLGu2aQFgXyqPtWr8Yp4CNN675xEhqd3UGCWg2hDVpvDq
LOG_LEVEL=info
MAIL_SENDER=openinventory@gmail.com
ETHEREAL_USERNAME=hazle.dickens@ethereal.email
ETHEREAL_PASSWORD=29rrnccVqMvX4wWVNa
SITE_API=https://openinventory.org/register
```

Then use `nodemon` or `node` to serve the pages.

```bash
npm run dev # to run using nodemon
npm start   # otherwise
```

Now visit <http://localhost:3000/> and confirm that site is running.
