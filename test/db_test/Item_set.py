import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_itemset_query = 'INSERT INTO "ItemSet"(id,title,image,"createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s)'

    # complete fields
    cursor.execute(insert_itemset_query,
                   ("b66df32f-d3e7-4976-b481-204d1f96cddf", "Mouse","", "2020-05-10", "2020-05-10"))
    connection.commit()

    # # same itemset id
    # cursor.execute(insert_itemset_query,
    #                ("b66df32f-d3e7-4976-b481-204d1f96cddf", "Transistor","", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # empty title
    cursor.execute(insert_itemset_query,
                   ("b66df32f-d3e7-4976-b481-304d1f96cddf", "","", "2020-05-10", "2020-05-10"))
    connection.commit()

    

except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to User table: ", error)
