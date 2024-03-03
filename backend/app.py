from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
app = Flask(__name__, static_folder="../frontend/build", static_url_path='/')
CORS(app)


# Define a function to interact with GPT-3
def ask_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Parse this user's order and create a json data structure in this format: {orders :  [{\"item_name\" :  \"the name\", \"quantity\" :  integer_here}]}"
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    raw_json = response.choices[0].message.content

    return json.loads(raw_json)

user_data = {}

# Endpoint for storing menu items
@app.route('/add-menu-items', methods=['POST'])
def add_menu_item():
    user_id = request.json['user_id']
    menu_item = request.json['menu_item']
    user_data.setdefault(user_id, {'menu_items': [], 'orders': []})['menu_items'].append(menu_item)
    print(user_data)
    return jsonify({'message': 'Menu item added successfully'})

# Endpoint for retrieving menu items
@app.route('/get-menu-items', methods=['POST'])
def get_menu_items():
    user_id = request.json.get('user_id')
    print(user_data)
    return jsonify({'menu_items': user_data.get(user_id, {'menu_items': []})['menu_items']})

@app.route('/')
def index():
    return send_from_directory('../frontend/build', 'index.html')

@app.route('/remove-menu-item', methods=['POST'])
def remove_menu_item():
    try:
        index = request.json['index']
        user_id = request.json['user_id']  # Assuming you also send the user_id with the request
        if user_id not in user_data:
            return jsonify({'error': 'User not found'}), 404
        if index < 0 or index >= len(user_data[user_id]['menu_items']):
            return jsonify({'error': 'Invalid index'}), 400
        
        # Remove the item from the menu items data structure
        del user_data[user_id]['menu_items'][index]
        
        return jsonify({'message': 'Item removed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Define route for handling chat requests
@app.route('/order', methods=['POST'])
def chat():
    request_data = request.get_json()
    user_message = request_data.get('user_message')
    bot_response = ask_gpt(user_message)
    return jsonify({'bot_response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
