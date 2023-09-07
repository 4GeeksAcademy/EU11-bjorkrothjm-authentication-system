"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, get_hash
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/sign-up', methods=['POST'])
def register_user():
    formData = request.get_json()
    print(formData)

    # test if email is unqiue
    new_user = User.query.filter_by(email=formData["email"]).first()
    if (new_user is not None):
        return jsonify({"message":"There already exists an account with the email you used"}), 400
    
   # hash password
    secure_password = get_hash(formData["password"])
    # add user to database 
    new_user = User(email=formData["email"], password=secure_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify( {"new_user": new_user.serialize(), "message":"User created"})

@api.route('/login', methods=["POST"])
def create_token():
    formData = request.get_json()
    print("PRINTING FORMDATA", formData)

    # test if email and password are correct
    new_user = User.query.filter_by(email=formData["email"], password=get_hash(formData["password"])).first()
    if new_user is None:
        #user not found in database
        return jsonify({"message": "Bad email or password"}), 401
    
    # create a a new access token with the user id inside
    access_token = create_access_token(identity= new_user.id)

    return jsonify({"token": access_token, "user_id": new_user.id, "message": "User logged in"}), 200