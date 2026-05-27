<?php
$db = new PDO('sqlite:' . __DIR__ . '/data.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    $db->exec("ALTER TABLE post ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
    echo "Kolumna 'created_at' dodana pomyślnie.\n";
} catch (PDOException $e) {
    echo "Błąd: " . $e->getMessage() . "\n";
}

echo "\nStruktura tabeli post:\n";
$result = $db->query("PRAGMA table_info(post)");
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo $row['name'] . " (" . $row['type'] . ")\n";
}