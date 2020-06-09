import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_item_attribute_query = 'INSERT INTO "ItemAttribute"("itemId",key,value,"createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s)'

    # # complete fields
    # cursor.execute(insert_item_attribute_query,
    #                ("94ee4946-213a-43de-931a-a0d8be5ad230", "color", "black", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # # itemId that not exist
    # cursor.execute(insert_item_attribute_query,
    #                ("94ee4946-213a-43de-931a-a0d8be5ad332", "color", "black", "false", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # empty key
    cursor.execute(insert_item_attribute_query,
                   ("94ee4946-213a-43de-931a-a0d8be5ad230", "", "black", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty value
    cursor.execute(insert_item_attribute_query,
                   ("94ee4946-213a-43de-931a-a0d8be5ad230", "size", "",  "2020-05-10", "2020-05-10"))
    connection.commit()


except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to Lab table: ", error)
