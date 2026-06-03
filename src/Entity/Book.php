<?php

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookRepository::class)]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $author = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $year = null;


    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function setTitle(?string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function setAuthor(?string $author): self
    {
        $this->author = $author;
        return $this;
    }

    public function setYear(?int $year): self
    {
        $this->year = $year;
        return $this;
    }
}
