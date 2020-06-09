import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_item_query = 'INSERT INTO "Item"(id,"serialNumber","labId","itemSetId","createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s)'

    # complete fields
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-204d1f96cddf", "012345678", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # same item id
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-204d1f96cddf", "012345678978", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # same serial number
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-205d1f96cddf", "012345678", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty itemId
    cursor.execute(insert_item_query,
                   ("", "012345678", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty serial number
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-208d1f96cddf", "", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty lab id
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-208d1f96cddf", "0123456789123", "", "b5e682e5-7427-407a-bd23-e42b868fd228", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty itemset id
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-208d1f96cddf", "0123456789123", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "", "2020-05-10", "2020-05-10"))
    connection.commit()

    # lab id that not exist
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-210d1f96cddf", "0123456789123", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5345", "b5e682e5-7427-407a-bd23-e42b868fd559", "2020-05-10", "2020-05-10"))
    connection.commit()

    # itemset id that not exist
    cursor.execute(insert_item_query,
                   ("b77df32f-d3e7-4976-b481-210d1f96cddf", "0123456789123", "3d04fd41-5abe-44cf-8cec-a1cfe2fe5299", "b5e682e5-7427-407a-bd23-e42b868fd559", "2020-05-10", "2020-05-10"))
    connection.commit()


except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to User table: ", error)
