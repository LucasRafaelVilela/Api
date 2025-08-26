<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->name(),
            'bio' => $this->faker->optional(0.8)->paragraph(3),
        ];
    }
}