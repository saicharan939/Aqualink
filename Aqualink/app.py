from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import json
import os
import mysql.connector
from config import DATABASE_CONFIG

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')
# Function to create a connection to the MySQL database
def get_db_connection():
    connection = mysql.connector.connect(
        host=DATABASE_CONFIG['host'],
        user=DATABASE_CONFIG['user'],
        password=DATABASE_CONFIG['password'],
        database=DATABASE_CONFIG['database']
    )
    return connection

# Load users data from JSON file
def load_users():
    with open(os.path.join(os.path.dirname(__file__), "data", "users.json")) as file:
     return json.load(file)

CORS(app, support_credentials=True)

@cross_origin(supports_credentials=True)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get data from the request (username, password)
    
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')  # either 'customer' or 'supplier'

    # Load users from the JSON file
    users_data = load_users()

    # Check if user_type is valid
    if user_type not in users_data:
        return jsonify({"message": "Invalid user type"}), 400
    
    # Check if the username and password are correct
    for user in users_data[user_type]:
        if user['username'] == username and user['password'] == password:
            print(username)
            return jsonify({"message": f"{user_type.capitalize()} login successful!"}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/")
def home():
    return render_template("customerhome.html")

@app.route("/customerhome")
def customerhome():
    return render_template("customerhome.html")

@app.route("/supplierhome")
def supplierhome():
    return render_template("supplierhome.html")
# Registration route
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    account_type = data['accountType']

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL query to insert new user data into the users table
        query = """
            INSERT INTO users (username, email, password, account_type)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (username, email, password, account_type))
        conn.commit()

        return jsonify({'success': True, 'message': 'Registration successful!'})

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'success': False, 'message': 'Registration failed.'})

    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)
