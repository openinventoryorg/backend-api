import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_lab_query = 'INSERT INTO "Lab"(id,title,subtitle,image,"createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s)'

    # complete fields
    cursor.execute(insert_lab_query,
                   ("b5e682e5-7427-407a-bd23-e42b868fd229", "lab_A", "final year", "", "2020-05-10", "2020-05-10"))
    connection.commit()

    # # same labId
    # cursor.execute(insert_lab_query,
    #                ("b5e682e5-7427-407a-bd23-e42b868fd229", "lab_A", "final year", "", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # empty title
    cursor.execute(insert_lab_query,
                   (("b5e682e5-7427-407a-bd23-e42b868fd230", " ", "final year", "", "2020-05-10", "2020-05-10")))
    connection.commit()

    # empty subtitle
    cursor.execute(insert_lab_query,
                   (("b5e682e5-7427-407a-bd23-e42b868fd231", "Lab_A ", "", "", "2020-05-10", "2020-05-10")))
    connection.commit()

    # delete_lab_query = 'DELETE FROM "Lab" WHERE id = %s'
    # cursor.execute(delete_lab_query,
    #                (("b5e682e5-7427-407a-bd23-e42b868fd229")))


except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to Lab table: ", error)
