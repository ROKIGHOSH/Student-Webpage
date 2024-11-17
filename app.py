from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from cryptography.fernet import Fernet
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Ensure the upload folder exists
UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Other models can be defined here

@app.route('/')
def index():
    uploaded_files = os.listdir(UPLOAD_FOLDER)
    return render_template('index.html', uploaded_files=uploaded_files)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify([])

    file = request.files['file']
    if file:
        file.save(os.path.join(UPLOAD_FOLDER, file.filename))

    return jsonify(os.listdir(UPLOAD_FOLDER))

@app.route('/save_note', methods=['POST'])
def save_note():
    note_content = request.form.get('note_content')
    file_name = request.form.get('file_name')
    file_type = request.form.get('file_type')
    
    if file_type == 'pdf':
        from fpdf import FPDF
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, note_content)
        
        pdf_file_path = os.path.join(UPLOAD_FOLDER, f"{file_name}.pdf")
        pdf.output(pdf_file_path)
    else:  # Save as TXT
        with open(os.path.join(UPLOAD_FOLDER, f"{file_name}.txt"), "w") as f:
            f.write(note_content)

    return jsonify(os.listdir(UPLOAD_FOLDER))

if __name__ == '__main__':
    with app.app_context():  # Add this block to create the tables within the application context
        db.create_all()  # Create database tables
    app.run(debug=True)
