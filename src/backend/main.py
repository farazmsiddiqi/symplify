from flask import Flask, request, session
from flask_mysqldb import MySQL
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)

SECRET_KEY=b'\xcf\xc7\xb3\xe9P\xb7\x9c\x96\xfc\x85\xa9\xd1'
SESSION_TYPE = "filesystem"

Session(app)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

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

@app.route("/login", methods = ["GET", "POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    cur = mysql.connection.cursor()
    query = f"SELECT * FROM User WHERE username = '{username}' AND password = '{password}'"

    try:
        cur.execute(query)
    except Exception as e:
        return str(e), 500
    
    rv = cur.fetchall()
    cur.close()

    if len(rv) <= 0:
       return "user does not exist", 403
    session["username"] = username
    return "success!", 200



@app.route("/update_user", methods = ["POST"])
def update_user():
    
    data = request.get_json()
    new_age = data["age"]
    new_sex = data["sex"]
    new_country = data["country"]

    if session.get("user_id") is None:
       return "user is not logged in", 500

    username = session.get("username")
    cur = mysql.connection.cursor()

    query = ""
    if new_age is not None:
       query = f"UPDATE Demographics SET age = '{new_age}' WHERE username = '{username}'"
    elif new_sex is not None:
       query = f"UPDATE Demographics SET sex = '{new_sex}' WHERE username = '{username}'"
    else:
       query = f"UPDATE Demographics SET country = '{new_country}' WHERE username = '{username}'"
    
    try:
        cur.execute(query)
    except Exception as e:
        return str(e), 500
    cur.close()

    return "success!", 200

@app.route('/search_symptom', methods=["GET"])
def search_sympton():

    data = request.get_json()
    symptom_name = data["symptomSearch"]

    cur = mysql.connection.cursor()
    query = f"SELECT trackable_name FROM Symptom WHERE trackable_name LIKE '{symptom_name}%' LIMIT 10"

    try:
        cur.execute(query)
    except Exception as e:
        return str(e), 500
    
    rv = cur.fetchall()
    cur.close()
    column = [item[0] for item in  rv]
    return json.dumps(column)

# @app.route('/user_count', methods=["GET"])
# def get_user_size():
#     cur = mysql.connection.cursor()
#     query = f"SELECT COUNT(user_id) FROM User"
    
#     try:
#         cur.execute(query)
#     except Exception as e:
#         return str(e), 500
    
#     rv = cur.fetchall()
#     cur.close()
#     #for char in str(rv):
#     #    if char not in ['0','1','2','3','4','5','6','7','8','9']:
#     s = str(rv)
#     s = s.replace('(', '').replace(')', '').replace(',', '')
#     if not s:
#         s = 0
#     return str(s)

@app.route('/insert', methods=["POST"])
def insert_records():
  data = request.get_json()
  table_name = data['table']

  weak_trackable_table_names = ['Condition', 'Symptom', 'Treatment', 'Tag', 'Weather']

  if table_name == "User":
    return handle_user_table(data['user_id'], data['username'], data['password'], data['email'])
  elif table_name in weak_trackable_table_names:
    return handle_weak_trackable_tables(table_name, data['trackable_id'], data['trackable_name'], data['trackable_value'])
  elif table_name == "Trackable":
    return handle_trackable_table(data['trackable_id'], data['trackable_type'])
  elif table_name == "Demographics":
    return handle_demographics_table(data['user_id'], data['age'], data['sex'], data['country'])
  elif table_name == "UserTracks":
    return handle_usertracks_table(data['trackable_id'], data['user_id'])

  cur = mysql.connection.cursor()
  cur.execute('SELECT * FROM Symptom')
  rv = cur.fetchall()
  #cur.close()
  return str(rv)


def handle_trackable_table(trackable_id, trackable_type):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO Trackable (trackable_id, trackable_type) VALUES (CAST('{trackable_id}' AS SIGNED), '{trackable_type}')"

  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200


def handle_demographics_table(user_id, age, sex, country):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO Demographics (user_id, age, sex, country) VALUES ('{user_id}', CAST('{age}' AS SIGNED), '{sex}', '{country}')"

  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200


def handle_usertracks_table(trackable_id, user_id):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO UserTracks (trackable_id, user_id) VALUES (CAST('{trackable_id}' AS SIGNED), '{user_id}')"

  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200


def handle_weak_trackable_tables(table_name, trackable_id, trackable_name, trackable_value):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO {table_name} (trackable_id, trackable_name, trackable_value) VALUES (CAST('{trackable_id}' AS SIGNED), '{trackable_name}', '{trackable_value}')"

  if table_name == "Tag":
    # Tag doesn't need trackable_value
    query = f"INSERT INTO {table_name} (trackable_id, trackable_name) VALUES (CAST('{trackable_id}' AS SIGNED), '{trackable_name}')"
  
  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200

def handle_user_table(user_id, username, password, email):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO User (user_id, username, password, email) VALUES ('{user_id}', '{username}', '{password}', '{email}')"
  
  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200



if __name__ == '__main__':
    app.run()

