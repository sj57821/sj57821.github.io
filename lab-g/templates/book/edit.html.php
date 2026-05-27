<!DOCTYPE html>
<html>
<head>
    <title>Edit Book</title>
</head>
<body>
<h1>Edit: <?= htmlspecialchars($book->getTitle()) ?></h1>

<form method="POST" action="/?action=book-edit&id=<?= $book->getId() ?>">
    <div>
        <label>Title:</label>
        <input type="text" name="title" value="<?= htmlspecialchars($book->getTitle()) ?>" required>
    </div>
    <div>
        <label>Author:</label>
        <input type="text" name="author" value="<?= htmlspecialchars($book->getAuthor()) ?>" required>
    </div>
    <div>
        <label>Year:</label>
        <input type="number" name="year" value="<?= htmlspecialchars($book->getYear()) ?>" required>
    </div>
    <button type="submit">Save</button>
</form>

<a href="/?action=book-index">Cancel</a>
</body>
</html>