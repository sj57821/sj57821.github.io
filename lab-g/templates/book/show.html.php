<!DOCTYPE html>
<html>
<head>
    <title>Book Details</title>
</head>
<body>
<h1>Book Details</h1>

<p><strong>ID:</strong> <?= htmlspecialchars($book->getId()) ?></p>
<p><strong>Title:</strong> <?= htmlspecialchars($book->getTitle()) ?></p>
<p><strong>Author:</strong> <?= htmlspecialchars($book->getAuthor()) ?></p>
<p><strong>Year:</strong> <?= htmlspecialchars($book->getYear()) ?></p>
<p><strong>Created at:</strong> <?= htmlspecialchars($book->getCreatedAt()) ?></p>

<a href="/?action=book-edit&id=<?= $book->getId() ?>">Edit</a>
<a href="/?action=book-index">Back to list</a>
</body>
</html>