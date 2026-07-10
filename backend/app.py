import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, UTC
from sqlalchemy import func
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

cors_origins_raw = os.getenv('CORS_ORIGINS', '*')
cors_origins = [origin.strip() for origin in cors_origins_raw.split(',') if origin.strip()]

CORS(app, 
     origins=cors_origins,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


database_url = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+pg8000://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+pg8000://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')


db = SQLAlchemy(app)
jwt = JWTManager(app)


# -- Models --
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    reputation = db.Column(db.Integer, default=0)

    # 'joined date'
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(UTC))
    
    # Add relationship to Answers
    answers = db.relationship('Answer', backref='author', lazy='dynamic')



class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


# Association table for the many-to-many relationship between Question and Tag
question_tags = db.Table('question_tags',
    db.Column('question_id', db.Integer, db.ForeignKey('question.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(UTC))

    vote_count = db.Column(db.Integer, default=0)
    answer_count = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    answers = db.relationship('Answer', backref='question', lazy='dynamic')

    
    # Foreign Key to link to the User who asked the question
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # Relationship to access the author object directly from a question
    author = db.relationship('User', backref=db.backref('questions', lazy=True))
    
    # Many-to-many relationship with Tag
    tags = db.relationship('Tag', secondary=question_tags, lazy='subquery',
        backref=db.backref('questions', lazy=True))

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
    is_accepted = db.Column(db.Boolean, default=False, nullable=False)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    # Direction: 1 for upvote, -1 for downvote
    direction = db.Column(db.Integer, nullable=False) 

    # Ensure a user can only vote once per question
    __table_args__ = (db.UniqueConstraint('user_id', 'question_id', name='_user_question_uc'),)

# -- Routes --

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check missing fields
    if not username or not email or not password:
        return jsonify({'msg': 'Missing fields'}), 400

    # Check if user already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'msg': 'User already exists'}), 409
    
    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg':'User created'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'msg': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'Invalid credentials'}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token':token})


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Get the user's ID from the JWT token
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    # Return user data (NEVER return the password hash)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

@app.route('/api/questions',methods=['POST'])
@jwt_required()
def ask_question():
    # Get the user ID from JWT token
    user_id = get_jwt_identity()
    data = request.json

    title = data.get('title')
    content=data.get('content')
    tags_data = data.get('tags') #his will be an array of strings like ['react', 'python']


    # ---Backend Validation ---
    if not title or not content or not tags_data:
        return jsonify({'msg':'Title, content, and tags are required'}), 400
    if len(tags_data)==0:
        return jsonify({'msg':'At least one tag is required'}), 400
    
    # ---Create the Question---
    new_question = Question(title=title, content=content, user_id=user_id)

    # ----Handle Tags ----
    # For each tag name provided, find it or create it, then associate it
    for tag_name in tags_data:
        # check if tag already exists
        tag = Tag.query.filter_by(name=tag_name.lower()).first()
        if not tag:
            # if it doesn't exist, create it
            tag = Tag(name=tag_name.lower())
            db.session.add(tag)
        # append the tag to the question's list of tags
        new_question.tags.append(tag)
    # --- commit to DB---
    db.session.add(new_question)
    db.session.commit()

    # the frontend needs the new question's id to navigate
    return jsonify({
        'msg':'Question created successfully',
        'question':{
            'id':new_question.id,
            'title':new_question.title
        }
    }),201

@app.route('/api/questions', methods=['GET'])
def get_questions():

    # Get the 'sort_by' parameter from the URL, default to 'newest'
    sort_by = request.args.get('sort_by', 'newest')

    if sort_by == 'votes':
        query = Question.query.order_by(Question.vote_count.desc())
    elif sort_by == 'views':
        query = Question.query.order_by(Question.views.desc())
    elif sort_by == 'answers':
        query = Question.query.order_by(Question.answer_count.desc())
    else: # Default to newest
        query = Question.query.order_by(Question.created_at.desc())

    questions_from_db = query.all()


    # prepare a list to hold the formatted question data
    questions_list = []

    for q in questions_from_db:
        questions_list.append({
            # The frontend expects 'id', not '_id'. We will fix this on the frontend.
            'id':q.id,
            'title':q.title,
            'content':q.content,
            # frontend expects an 'author' object
            'author':{
                'username':q.author.username,
                'reputation':q.author.reputation
            },
            # frontend expects an array of tagnames(string)
            'tags':[tag.name for tag in q.tags],
            # Map our snake_case column names to the frontend's camelCase names
            'voteCount':q.vote_count,
            'answerCount':q.answer_count,
            'views':q.views,
            # Format the datetime object into a standard ISO string
            'createdAt':q.created_at.isoformat()
            # We don't have 'acceptedAnswer' yet, so we omit it (it's optional)
        })
    return jsonify(questions_list), 200

# In app.py, add this new route

@app.route('/api/questions/<int:question_id>/vote', methods=['POST'])
@jwt_required()
def vote_on_question(question_id):
    user_id = get_jwt_identity()
    data = request.json
    direction = data.get('direction') # Expects 'up' or 'down'

    question = Question.query.get(question_id)
    if not question:
        return jsonify({"msg": "Question not found"}), 404

    vote_value = 1 if direction == 'up' else -1

    existing_vote = Vote.query.filter_by(user_id=user_id, question_id=question_id).first()

    if existing_vote:
        # If the new vote is in the same direction, user is toggling off their vote
        if existing_vote.direction == vote_value:
            question.vote_count -= vote_value
            db.session.delete(existing_vote)
        # If the new vote is in the opposite direction, change the vote
        else:
            question.vote_count += (2 * vote_value) # Remove old vote, add new vote
            existing_vote.direction = vote_value
    else:
        # No existing vote, create a new one
        new_vote = Vote(user_id=user_id, question_id=question_id, direction=vote_value)
        question.vote_count += vote_value
        db.session.add(new_vote)

    db.session.commit()
    return jsonify({"msg": "Vote recorded", "newVoteCount": question.vote_count}), 200

# In app.py

@app.route('/api/tags', methods=['GET'])
def get_tags():
    """
    This simple endpoint fetches all tags and, for each tag,
    a list of its associated questions' basic stats.
    """
    all_tags = Tag.query.all()
    
    tags_list = []
    for tag in all_tags:
        # For each tag, we build a dictionary
        tag_data = {
            'name': tag.name,
            'description': tag.description or f"Questions related to the '{tag.name}' tag.",
            # We attach a list of question stats for the frontend to calculate with
            'questions': [
                {
                    'answer_count': q.answer_count,
                    'views': q.views,
                    'created_at': q.created_at.isoformat()
                } 
                for q in tag.questions
            ]
        }
        tags_list.append(tag_data)
        
    return jsonify(tags_list)

#  display users
@app.route('/api/users', methods=['GET'])
def get_users():
    users_from_db = User.query.all()
    
    users_list = []
    for user in users_from_db:
        # For simplicity, badges are derived from reputation.
        badges = []
        if user.reputation >= 1000:
            badges.append('Gold')
        if user.reputation >= 500:
            badges.append('Silver')
        if user.reputation >= 100:
            badges.append('Bronze')
            
        users_list.append({
            'id': user.id,
            'username': user.username,
            'reputation': user.reputation,
            'questionsAsked': len(user.questions),
            'answersGiven': user.answers.count(),
            'acceptedAnswers': user.answers.filter_by(is_accepted=True).count(),
            'joinedDate': user.created_at.isoformat(),
            'badges': badges,
            # Online status is complex; we'll hardcode it for now
            'isOnline': False 
        })
        
    return jsonify(users_list)

@app.route('/api/sidebar-stats', methods=['GET'])
def get_sidebar_stats():
    """
    Provides aggregated statistics for the site sidebar in a single, efficient call.
    """
    # Use func.count() for efficient database-level counting
    question_count = db.session.query(func.count(Question.id)).scalar()
    answer_count = db.session.query(func.count(Answer.id)).scalar()
    user_count = db.session.query(func.count(User.id)).scalar()
    
    # This query finds the top 5 most popular tags
    popular_tags_query = db.session.query(Tag.name).join(Tag.questions).group_by(Tag.name).order_by(func.count(Question.id).desc()).limit(5).all()
    
    # The query returns a list of tuples, so we extract the first element (the name) from each
    popular_tags = [tag[0] for tag in popular_tags_query]
    
    # Combine everything into a single JSON response
    return jsonify({
        "quickStats": {
            "questions": question_count,
            "answers": answer_count,
            "users": user_count
        },
        "popularTags": popular_tags
    })


@app.route('/api/items', methods=['GET'])
@jwt_required()
def get_items():
    user_id = get_jwt_identity()
    items = Item.query.filter_by(user_id=user_id).all()
    return jsonify([{'id':i.id, 'name':i.name} for i in items])

@app.route('/api/items', methods=['POST'])
@jwt_required()
def add_item():
    data = request.json
    user_id = get_jwt_identity()
    item = Item(name=data['name'], user_id=user_id)
    db.session.add(item)
    db.session.commit()
    return jsonify({'msg': 'Item added'}), 201

@app.route('/api/questions/<int:question_id>', methods=['GET'])
def get_question_by_id(question_id):
    question = Question.query.get_or_404(question_id)
    
    # Increment views
    question.views += 1
    db.session.commit()
    
    author_data = {'username': 'Unknown', 'reputation': 0, 'id': -1}
    if question.author:
        author_data = {'id': question.author.id, 'username': question.author.username, 'reputation': question.author.reputation}

    return jsonify({
        'id': question.id,
        'title': question.title,
        'content': question.content,
        'author': author_data,
        'tags': [tag.name for tag in question.tags],
        'voteCount': question.vote_count,
        'answerCount': question.answer_count,
        'views': question.views,
        'createdAt': question.created_at.isoformat()
    })


@app.route('/api/questions/<int:question_id>/answers', methods=['GET'])
def get_answers_for_question(question_id):
    question = Question.query.get_or_404(question_id)
    answers = question.answers.order_by(Answer.is_accepted.desc(), Answer.created_at.asc()).all()
    
    answers_list = []
    for answer in answers:
        author_data = {'username': 'Unknown', 'reputation': 0, 'id': -1}
        if answer.author:
            author_data = {'id': answer.author.id, 'username': answer.author.username, 'reputation': answer.author.reputation}
        
        answers_list.append({
            'id': answer.id,
            'content': answer.content,
            'author': author_data,
            'isAccepted': answer.is_accepted,
            'createdAt': answer.created_at.isoformat(),
            'voteCount': 0 # Note: We need a vote model for answers to implement this fully
        })
    return jsonify(answers_list)


@app.route('/api/questions/<int:question_id>/answers', methods=['POST'])
@jwt_required()
def post_answer(question_id):
    user_id = get_jwt_identity()
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({'msg': 'Answer content is required'}), 400

    question = Question.query.get_or_404(question_id)
    
    new_answer = Answer(content=content, user_id=user_id, question_id=question_id)
    question.answer_count += 1
    
    db.session.add(new_answer)
    db.session.commit()
    
    # We can return the new answer so the frontend can add it without a refetch
    author = User.query.get(user_id)
    return jsonify({
        'id': new_answer.id,
        'content': new_answer.content,
        'author': {'id': author.id, 'username': author.username, 'reputation': author.reputation},
        'isAccepted': new_answer.is_accepted,
        'createdAt': new_answer.created_at.isoformat(),
        'voteCount': 0
    }), 201


@app.route('/api/answers/<int:answer_id>/accept', methods=['POST'])
@jwt_required()
def accept_answer(answer_id):
    user_id = get_jwt_identity()
    answer_to_accept = Answer.query.get_or_404(answer_id)
    question = answer_to_accept.question

    # Security check: only the author of the question can accept an answer
    if str(question.author.id) != user_id:
        return jsonify({'msg': 'Not authorized to accept an answer for this question'}), 403

    # Reset any previously accepted answer for this question
    Answer.query.filter_by(question_id=question.id, is_accepted=True).update({'is_accepted': False})
    
    # Accept the new answer
    answer_to_accept.is_accepted = True
    db.session.commit()
    
    return jsonify({'msg': 'Answer accepted successfully'}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    app.run(host='0.0.0.0', port=port, debug=debug)


