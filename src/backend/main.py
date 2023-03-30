from flask import Flask
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv
import requests

app = Flask(__name__)

load_dotenv()
SQL_INSTANCE_PASS = os.getenv('PASSWORD')
SQL_INSTANCE_USER = os.getenv('MYSQL_USER')
SQL_INSTANCE_HOST = os.getenv('MYSQL_HOST')
SQL_INSTANCE_DB = os.getenv('MYSQL_DB')

# Configure MySQL connection
app.config['MYSQL_HOST'] = SQL_INSTANCE_HOST
app.config['MYSQL_USER'] = SQL_INSTANCE_USER
app.config['MYSQL_PASSWORD'] = SQL_INSTANCE_PASS
app.config['MYSQL_DB'] = SQL_INSTANCE_DB

# Create MySQL object
mysql = MySQL(app)

# Flask stuff
@app.route('/')
def hello_world():
    # Create MySQL cursor
    cur = mysql.connection.cursor()

    # Execute query to insert data into database
    # cur.execute('USE symplify-database')
    cur.execute('SELECT * FROM Symptom')
    rv = cur.fetchall()
    return str(rv)

@app.route('/insert', methods=["POST"])
def insert_records():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM Symptom')
    rv = cur.fetchall()
    return str(rv)




if __name__ == '__main__':
    app.run()

