from flask import Flask
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
SQL_INSTANCE_PASS = os.getenv('PASSWORD')

# Configure MySQL connection
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'mydatabase'

# Create MySQL object
mysql = MySQL(app)

# Flask stuff
@app.route('/')
def hello_world():
    return 'fasd, World!'

@app.route('/insert', methods=["POST"])
def insert_records():
     # Get data from request body
    data = request.get_json()

    # Extract data fields
    name = data['name']
    age = data['age']

    # Create MySQL cursor
    cur = mysql.connection.cursor()

    # Execute query to insert data into database
    query = "INSERT INTO mytable (name, age) VALUES (%s, %s)"
    values = (name, age)
    cur.execute(query, values)

    # Commit changes to database and close connection
    mysql.connection.commit()
    cur.close()

    # Return success message
    return 'not implemented'




if __name__ == '__main__':
    app.run()

