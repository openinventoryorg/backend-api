import psycopg2

try:
    connection = psycopg2.connect(
        user="openinventoryuser", password="Abcd@123", host="127.0.0.1", port="5432", database="openinventorydatabase")
    print("Database opened successfully")
    cursor = connection.cursor()
    insert_user_query = 'INSERT INTO "User"(id,"firstName","lastName",password,active,email,"roleId","createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'

    # complete fields
    cursor.execute(insert_user_query,
                   ("b66df32f-d3e7-4976-b481-204d1f96cddf", "AdminFirst", "AdminLast", "admin@123", "true", "admin@admin1.com", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    connection.commit()

    # # same user id
    # cursor.execute(insert_user_query,
    #                ("b66df32f-d3e7-4976-b481-204d0f96cddf", "AdminFirst", "AdminLast", "admin@admin1.com", "true", "admin@123", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    # connection.commit()

    #  # same email
    # cursor.execute(insert_user_query,
    #                ("b66df32f-d3e7-4976-b481-214d0f96cddf", "AdminFirst", "AdminLast", "admin@admin.com", "true", "admin@123", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # empty firstName
    cursor.execute(insert_user_query, ("b66df32f-d3e7-4976-b481-304d0f96cddf", "", "AdminLast",
                   "admin@123", "true", "admin@admin2.com", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty lastName
    cursor.execute(insert_user_query, ("b66df32f-d3e7-4976-b481-404d0f96cddf", "AdminFirst", "",
                   "admin@123", "true", "admin@admin3.com", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    connection.commit()

    # empty password
    cursor.execute(insert_user_query, ("b66df32f-d3e7-4976-b481-504d0f96cddf", "AdminFirst", "AdminLast",
                   "", "true", "admin@admin4.com", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    connection.commit()

    # # empty active
    # cursor.execute(insert_user_query, ("b66df32f-d3e7-4976-b481-604d0f96cddf", "AdminFirst", "AdminLast",
    #                "admin@123", "", "admin@admin4.com", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    # connection.commit()

    # empty email
    cursor.execute(insert_user_query,
                   ("b66df32f-d3e7-4976-b481-704d1f96cddf", "AdminFirst", "AdminLast", "admin@123", "true", "", "efda9842-8121-449c-9215-14d8ed3dda89", "2020-05-10", "2020-05-10"))
    connection.commit()

    # # empty roleId
    # cursor.execute(insert_user_query,
    #                ("b66df32f-d3e7-4976-b481-804d1f96cddf", "AdminFirst", "AdminLast", "admin@123", "true", "admin@admin1.com", "", "2020-05-10", "2020-05-10"))
    # connection.commit()


except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to User table: ", error)
