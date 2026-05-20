<!DOCTYPE html>
<html>
<head>
    <title>Create Book</title>
</head>
<body>
<h1>Create new book</h1>

<form method="POST" action="/?action=book-create">
    <div>
        <label>Title:</label>
        <input type="text" name="title" required>
    </div>
    <div>
        <label>Author:</label>
        <input type="text" name="author" required>
    </div>
    <div>
        <label>Year:</label>
        <input type="number" name="year" required>
    </div>
    <button type="submit">Save</button>
</form>

<a href="/?action=book-index">Cancel</a>
</body>
</html>