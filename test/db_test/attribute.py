import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_attribute_query = 'INSERT INTO "Attribute"("itemSetId",key,"defaultValue",editable,"createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s)'

    # # complete fields
    # cursor.execute(insert_attribute_query,
    #                ("b5e682e5-7427-407a-bd23-e42b868fd228", "size", "small", "false", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # # itemsetId that not exist
    # cursor.execute(insert_attribute_query,
    #                ("b5e682e5-7427-407a-bd23-e42b868fd452", "color", "black", "false", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # # empty key
    # cursor.execute(insert_attribute_query,
    #                ("b5e682e5-7427-407a-bd23-e42b868fd228", "", "black", "false", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # editabale = false defaultValue = ""
    cursor.execute(insert_attribute_query,
                   ("b5e682e5-7427-407a-bd23-e42b868fd228", "voltage", "", "false", "2020-05-10", "2020-05-10"))
    connection.commit()

    


except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to Lab table: ", error)
