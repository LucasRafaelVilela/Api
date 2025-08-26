<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition()
    {
        $generos = ['Romance', 'Ficção', 'Drama', 'Comédia', 'Aventura', 'Mistério', 'Biografia', 'História', 'Poesia', 'Ensaio'];
        
        return [
            'titulo' => $this->faker->sentence(3, true),
            'autor_id' => Author::factory(),
            'ano_publicacao' => $this->faker->optional(0.9)->numberBetween(1800, 2024),
            'paginas' => $this->faker->optional(0.8)->numberBetween(50, 1000),
            'genero' => $this->faker->optional(0.7)->randomElement($generos),
            'disponivel' => $this->faker->boolean(80), // 80% chance de estar disponível
        ];
    }

    public function unavailable()
    {
        return $this->state(function (array $attributes) {
            return [
                'disponivel' => false,
            ];
        });
    }

    public function forAuthor($authorId)
    {
        return $this->state(function (array $attributes) use ($authorId) {
            return [
                'autor_id' => $authorId,
            ];
        });
    }
}