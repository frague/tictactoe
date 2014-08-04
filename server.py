import os
from flask import Flask, send_file, request, session

app = Flask(__name__)
app.secret_key = '6f8s76f87ds68fsd-s8f68dsf99s-fdh9gf879hs98s9899-8979'

approot = os.getcwd() + '/static'

@app.route('/')
def index():
    return send_file(approot + '/index.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3333, debug=True)
