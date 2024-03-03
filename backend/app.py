from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
app = Flask(__name__)
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

# Define route for home page
@app.route('/')
def index():
    #msg = ask_gpt("Hello, I want a burger and 2 fries please.")
    msg = ask_gpt("so can I please have a burger a hot dog and a large Coca-Cola")
    return msg

# Define route for handling chat requests
@app.route('/order', methods=['POST'])
def chat():
    request_data = request.get_json()
    user_message = request_data.get('user_message')
    bot_response = ask_gpt(user_message)
    return jsonify({'bot_response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
