import psycopg2

try:
    connection = psycopg2.connect(
        user="yazpmkitbupthn",
        password="577b890573a5f82d4c7a58ea1df45d373ffd669fe1e00896fe5b85437775d4f4",
        host="ec2-18-215-99-63.compute-1.amazonaws.com",
        port="5432",
        database="d1mtl9rejgtepp")
    print("Database opened successfully")
    cursor = connection.cursor()
    itemSetId = "b5e682e5-7427-407a-bd23-e42b868fd228"
    key = "size"
    defaultValue = "80"
    editable = False
    insert_attribute_query = 'INSERT INTO "Attribute"("itemSetId",key,"defaultValue", editable, "createdAt", "updatedAt") VALUES (%s, %s, %s, %s, %s, %s)'
    cursor.execute(insert_attribute_query,
                   (("b5e682e5-7427-407a-bd23-e42b868fd228", "size", "80", False, "2020-05-10", "2020-05-10")))
    delete_attribute_query = 'DELETE FROM "Attribute" WHERE "itemSetId"=b5e682e5-7427-407a-bd23-e42b868fd228 AND key =size'
    cursor.execute(delete_attribute_query)
    # mobile_records = cursor.fetchall()
    # for row in mobile_records:
    #    print("Id = ", row )

except (Exception, psycopg2.Error) as error:
    print("Error while inserting data to Attribute table", error)
