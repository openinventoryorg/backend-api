import psycopg2

try:
    connection = psycopg2.connect(
        user="postgres", password="password", host="127.0.0.1", port="5432", database="smartlab")
    print("Database opened successfully")
    cursor = connection.cursor()
    postgreSQL_select_Query = 'select * from "Lab"'
    cursor.execute(postgreSQL_select_Query)
    mobile_records = cursor.fetchall()
    print("Selecting rows from mobile table using cursor.fetchall")
    for row in mobile_records:
        print("Id = ", row)

except (Exception, psycopg2.Error) as error:
    print("Error while fetching data from PostgreSQL", error)
