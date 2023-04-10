from flask import Flask, request, session
import dataclasses
from flask_mysqldb import MySQL
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
from searchSymptom import SearchSymptom
from searchSymptom import PopularSymptom
from searchSymptom import ConditionsTreatments

app = Flask(__name__)

SECRET_KEY=b'xcfxc7xb3xe9Pxb7x9cx96xfcx85xa9xd1'
SESSION_TYPE = "filesystem"
SESSION_COOKIE_SAMESITE="None"
SESSION_COOKIE_SECURE=True

app.config.from_object(__name__)
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

@app.route("/whoami", methods=["GET"])
def whoami():
  print(session.get("username"))
  if session.get("username") is None:
    return "user is not logged in", 400
  return str(session.get("username")), 200


@app.route("/user_symptom", methods=["GET"])
def user_symptom():
  if session.get("username") is None:
    return "user is not logged in", 400
  
  username = session.get("username")

  cur = mysql.connection.cursor()
  query = f"SELECT DISTINCT trackable_id, trackable_name FROM Symptom NATURAL JOIN UserTracks WHERE username = '{username}'"

  try:
        cur.execute(query)
  except Exception as e:
        return str(e), 500
    
  rv = cur.fetchall()
  cur.close()

  ids = []
  for entry in rv:
      ids.append(SearchSymptom(entry[0], entry[1]))

  data_dict = [dataclasses.asdict(data) for data in ids]
  return json.dumps(data_dict)

@app.route("/popular_symptoms", methods = ["GET"])
def popular_symptoms():
  cur = mysql.connection.cursor()
  query = f"SELECT s.trackable_name as Symptom, COUNT(d.trackable_name) as NumDiagnoses FROM Symptom s LEFT JOIN Diagnosis d ON (s.trackable_id = d.trackable_id) GROUP BY s.trackable_name ORDER BY NumDiagnoses DESC LIMIT 30;"

  try:
      cur.execute(query)
  except Exception as e:
      return str(e), 500

  rv = cur.fetchall()
  cur.close()

  symps = []
  for entry in rv:
      symps.append(PopularSymptom(entry[0], entry[1]))

  data_dict = [dataclasses.asdict(data) for data in symps]
  return json.dumps(data_dict)
   
@app.route("/conditions_treatments", methods = ["GET"])
def conditions_treatments():
  cur = mysql.connection.cursor()
  query = f"SELECT d.trackable_name as Diagnosis, t.trackable_name as Treatment, COUNT(t.trackable_name) as NumTreatments, t.trackable_value as Dosage FROM Treatment t RIGHT JOIN Diagnosis d ON (t.trackable_id = d.trackable_id) WHERE t.trackable_name IS NOT NULL GROUP BY d.trackable_name, t.trackable_name, t.trackable_value ORDER BY NumTreatments DESC LIMIT 30;"

  try:
      cur.execute(query)
  except Exception as e:
      return str(e), 500

  rv = cur.fetchall()
  cur.close()

  symps = []
  for entry in rv:
      symps.append(ConditionsTreatments(entry[0], entry[1], entry[2], entry[3]))

  data_dict = [dataclasses.asdict(data) for data in symps]
  return json.dumps(data_dict)
   

@app.route("/symptom_name", methods = ["GET"])
def symptom_name():
  trackable_id = request.args.get('trackableId', 0, type=int)
  #symptom_name = request.args.get('trackableId', "", type=str)

  cur = mysql.connection.cursor()
  query = f"SELECT trackable_name FROM Symptom WHERE trackable_id = '{trackable_id}'"

  try:
      cur.execute(query)
  except Exception as e:
      return str(e), 500

  rv = cur.fetchall()
  cur.close()

  trackable_name = [item[0] for item in rv][0]

  return trackable_name
   
@app.route("/logout")
def logout():
   session.pop("username", None)
   return "logout success", 200

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
    print(session.get("username"))
    return "success!", 200

@app.route("/delete_usertrack", methods = ["POST"])
def delete_usertrack():
    data = request.get_json()
    trackable_id = data["trackableId"]

    if session.get("username") is None:
       return "user is not logged in", 400

    username = session.get("username")
    cur = mysql.connection.cursor()

    query = f"DELETE FROM UserTracks WHERE username = '{username}' AND trackable_id = '{trackable_id}'"

    try:
        cur.execute(query)
    except Exception as e:
        print(str(e))
        return str(e), 500
    mysql.connection.commit()
    cur.close()

    return "success!", 200


@app.route("/update_symptom", methods = ["POST"])
def update_symptom():
    data = request.get_json()
    new_name = data["symptomName"]
    trackableId = data["trackableId"]
    print(new_name)

    query = f"UPDATE Symptom SET trackable_name = '{new_name}' WHERE trackable_id = '{trackableId}'"
    
    cur = mysql.connection.cursor()

    try:
        cur.execute(query)
    except Exception as e:
        return str(e), 500
    mysql.connection.commit()
    cur.close()

    return "success!", 200


@app.route("/update_user", methods = ["POST"])
def update_user():
    
    data = request.get_json()
    new_age = data["age"]
    new_sex = data["sex"]
    new_country = data["country"]

    if session.get("username") is None:
       return "user is not logged in", 400

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
    mysql.connection.commit()
    cur.close()

    return "success!", 200

@app.route('/search_symptom', methods=["GET"])
def search_symptom():
    symptom_name = request.args.get('searchSymptom', "", type=str)

    cur = mysql.connection.cursor()
    query = f"SELECT DISTINCT trackable_id, trackable_name FROM Symptom WHERE trackable_name LIKE '{symptom_name}%' LIMIT 10"

    try:
        cur.execute(query)
    except Exception as e:
        return str(e), 500
    
    rv = cur.fetchall()
    cur.close()

    ids = []
    for entry in rv:
       ids.append(SearchSymptom(entry[0], entry[1]))

    #ids = [item[0] for item in rv]
    data_dict = [dataclasses.asdict(data) for data in ids]
    return json.dumps(data_dict)

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
    return handle_user_table(data['username'], data['password'], data['email'])
  elif table_name in weak_trackable_table_names:
    return handle_weak_trackable_tables(table_name, data['trackable_id'], data['trackable_name'], data['trackable_value'])
  elif table_name == "Trackable":
    return handle_trackable_table(data['trackable_id'], data['trackable_type'])
  elif table_name == "Demographics":
    return handle_demographics_table(data['username'], data['age'], data['sex'], data['country'])
  elif table_name == "UserTracks":
    return handle_usertracks_table(data['trackable_id'], data['username'])

  #cur = mysql.connection.cursor()
  #cur.execute('SELECT * FROM Symptom')
  #rv = cur.fetchall()
  #cur.close()
  return "success", 200


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
  query = f"INSERT INTO Demographics (username, age, sex, country) VALUES ('{user_id}', CAST('{age}' AS SIGNED), '{sex}', '{country}')"

  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200


def handle_usertracks_table(trackable_id, user_id):
  cur = mysql.connection.cursor()
  query =  f"INSERT INTO UserTracks (trackable_id, username) SELECT CAST('{trackable_id}' AS SIGNED), '{user_id}' WHERE NOT EXISTS (SELECT trackable_id, username FROM UserTracks t2 WHERE t2.trackable_id = CAST('{trackable_id}' AS SIGNED) AND t2.username = '{user_id}');"
 
  try:
    cur.execute(query)
  
  except Exception as e:
    print(str(e))
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

def handle_user_table(username, password, email):
  cur = mysql.connection.cursor()
  query = f"INSERT INTO User (username, password, email) VALUES ('{username}', '{password}', '{email}')"
  
  try:
    cur.execute(query)
  
  except Exception as e:
    return str(e), 500
  
  mysql.connection.commit()
  cur.close()

  return "Success", 200



if __name__ == '__main__':
    app.run()

