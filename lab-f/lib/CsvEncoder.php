<?php

namespace App;

class CsvEncoder implements EncoderInterface
{
    private string $delimiter;

    public function __construct(string $delimiter = ',')
    {
        $this->delimiter = $delimiter;
    }

    public function supports(string $format): bool
    {
        return in_array($format, ['csv', 'ssv', 'tsv']);
    }

    public function decode(string $data): array
    {
        $lines = explode("\n", trim($data));
        $headers = str_getcsv($lines[0], $this->delimiter);
        $result = [];

        for ($i = 1; $i < count($lines); $i++) {
            $row = str_getcsv($lines[$i], $this->delimiter);
            if (count($row) === count($headers)) {
                $result[] = array_combine($headers, $row);
            }
        }

        return $result;
    }

    public function encode(array $data): string
    {
        if (empty($data)) {
            return '';
        }

        $headers = array_keys($data[0]);
        $output = implode($this->delimiter, $headers) . "\n";

        foreach ($data as $row) {
            $output .= implode($this->delimiter, $row) . "\n";
        }

        return $output;
    }
}