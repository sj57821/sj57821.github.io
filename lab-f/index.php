<?php


spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/lib/';

    if (strpos($class, $prefix) === 0) {
        $relative = substr($class, strlen($prefix));
        $file = $baseDir . str_replace('\\', '/', $relative) . '.php';
        if (file_exists($file)) {
            require $file;
        }
    }
});

use App\CsvEncoder;
use App\JsonEncoder;
use App\YamlEncoder;

$encoders = [
    'csv' => new CsvEncoder(','),
    'ssv' => new CsvEncoder(';'),
    'tsv' => new CsvEncoder("\t"),
    'json' => new JsonEncoder(),
    'yaml' => new YamlEncoder(),
];


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    setcookie('input_data', $_POST['input_data'] ?? '', time() + 3600);
    setcookie('input_format', $_POST['input_format'] ?? '', time() + 3600);
    setcookie('output_format', $_POST['output_format'] ?? '', time() + 3600);
    $_POST['input_data'] = $_POST['input_data'] ?? '';
    $_POST['input_format'] = $_POST['input_format'] ?? 'tsv';
    $_POST['output_format'] = $_POST['output_format'] ?? 'tsv';
} else {
    $_POST['input_data'] = $_COOKIE['input_data'] ?? '';
    $_POST['input_format'] = $_COOKIE['input_format'] ?? 'tsv';
    $_POST['output_format'] = $_COOKIE['output_format'] ?? 'tsv';
}

$output = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['input_data'])) {
    try {
        $inputEncoder = $encoders[$_POST['input_format']] ?? null;
        $outputEncoder = $encoders[$_POST['output_format']] ?? null;

        if (!$inputEncoder || !$outputEncoder) {
            throw new Exception('Nieobsługiwany format');
        }

        $data = $inputEncoder->decode($_POST['input_data']);
        $output = $outputEncoder->encode($data);
    } catch (Exception $e) {
        $error = 'Błąd: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Konwerter</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        textarea { width: 100%; height: 200px; }
        pre { background: #f4f4f4; padding: 10px; }
        .error { color: red; }
    </style>
</head>
<body>
<h1>Konwerter danych</h1>
<form method="POST">
    <textarea name="input_data"><?php echo htmlspecialchars($_POST['input_data']); ?></textarea><br>
    <select name="input_format">
        <?php foreach (['csv'=>'CSV','ssv'=>'SSV','tsv'=>'TSV','json'=>'JSON','yaml'=>'YAML'] as $val => $label): ?>
            <option value="<?= $val ?>" <?= $_POST['input_format'] === $val ? 'selected' : '' ?>><?= $label ?></option>
        <?php endforeach; ?>
    </select>
    <select name="output_format">
        <?php foreach (['csv'=>'CSV','ssv'=>'SSV','tsv'=>'TSV','json'=>'JSON','yaml'=>'YAML'] as $val => $label): ?>
            <option value="<?= $val ?>" <?= $_POST['output_format'] === $val ? 'selected' : '' ?>><?= $label ?></option>
        <?php endforeach; ?>
    </select>
    <button type="submit">Konwertuj</button>
</form>
<?php if ($error): ?>
    <p class="error"><?= htmlspecialchars($error) ?></p>
<?php endif; ?>
<?php if ($output): ?>
    <h3>Wynik:</h3>
    <pre><?= htmlspecialchars($output) ?></pre>
<?php endif; ?>
</body>
</html>