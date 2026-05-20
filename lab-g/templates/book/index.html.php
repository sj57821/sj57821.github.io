<!DOCTYPE html>
<html>
<head>
    <title>Books List</title>
</head>
<body>
<h1>Books List</h1>

<a href="/?action=book-create">Create new book</a>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Author</th>
        <th>Year</th>
        <th>Actions</th>
    </tr>
    <?php foreach ($books as $book): ?>
        <tr>
            <td><?= htmlspecialchars($book->getId()) ?></td>
            <td><?= htmlspecialchars($book->getTitle()) ?></td>
            <td><?= htmlspecialchars($book->getAuthor()) ?></td>
            <td><?= htmlspecialchars($book->getYear()) ?></td>
            <td>
                <a href="/?action=book-show&id=<?= $book->getId() ?>">Show</a>
                <a href="/?action=book-edit&id=<?= $book->getId() ?>">Edit</a>
                <a href="/?action=book-delete&id=<?= $book->getId() ?>" onclick="return confirm('Are you sure?')">Delete</a>
            </td>
        </tr>
    <?php endforeach; ?>
</table>

<hr>
<a href="/">Back to Posts</a>
</body>
</html>