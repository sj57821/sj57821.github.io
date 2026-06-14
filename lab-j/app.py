from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os

app = Flask(__name__)
PORT = 57821
DATABASE = 'data.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/books')
def index():
    conn = get_db()
    books = conn.execute('SELECT * FROM books ORDER BY created_at DESC').fetchall()
    conn.close()
    return render_template('books/index.html', books=books)

@app.route('/books/<int:id>')
def show(id):
    conn = get_db()
    book = conn.execute('SELECT * FROM books WHERE id = ?', (id,)).fetchone()
    conn.close()
    return render_template('books/show.html', book=book)

@app.route('/books/new', methods=['GET', 'POST'])
def new():
    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        year = request.form['year']
        conn = get_db()
        conn.execute('INSERT INTO books (title, author, year) VALUES (?, ?, ?)',
                     (title, author, year))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('books/new.html')

@app.route('/books/<int:id>/edit', methods=['GET', 'POST'])
def edit(id):
    conn = get_db()
    book = conn.execute('SELECT * FROM books WHERE id = ?', (id,)).fetchone()
    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        year = request.form['year']
        conn.execute('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?',
                     (title, author, year, id))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    conn.close()
    return render_template('books/edit.html', book=book)

@app.route('/books/<int:id>/delete', methods=['POST'])
def delete(id):
    conn = get_db()
    conn.execute('DELETE FROM books WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=PORT)