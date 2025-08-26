<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\Author;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Buscar autores existentes
        $machadoId = Author::where('nome', 'Machado de Assis')->first()->id;
        $clariceId = Author::where('nome', 'Clarice Lispector')->first()->id;
        $jorgeId = Author::where('nome', 'Jorge Amado')->first()->id;
        $drummondId = Author::where('nome', 'Carlos Drummond de Andrade')->first()->id;
        $ceciliaId = Author::where('nome', 'Cecília Meireles')->first()->id;
        $limaId = Author::where('nome', 'Lima Barreto')->first()->id;
        $rosaId = Author::where('nome', 'Guimarães Rosa')->first()->id;
        $rachelId = Author::where('nome', 'Rachel de Queiroz')->first()->id;
        $saramagoId = Author::where('nome', 'José Saramago')->first()->id;
        $pessoaId = Author::where('nome', 'Fernando Pessoa')->first()->id;

        $books = [
            // Machado de Assis
            ['titulo' => 'Dom Casmurro', 'autor_id' => $machadoId, 'ano_publicacao' => 1899, 'paginas' => 256, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'O Cortiço', 'autor_id' => $machadoId, 'ano_publicacao' => 1890, 'paginas' => 304, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'Memórias Póstumas de Brás Cubas', 'autor_id' => $machadoId, 'ano_publicacao' => 1881, 'paginas' => 288, 'genero' => 'Romance', 'disponivel' => false],

            // Clarice Lispector
            ['titulo' => 'A Hora da Estrela', 'autor_id' => $clariceId, 'ano_publicacao' => 1977, 'paginas' => 192, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'Água Viva', 'autor_id' => $clariceId, 'ano_publicacao' => 1973, 'paginas' => 144, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'A Paixão Segundo G.H.', 'autor_id' => $clariceId, 'ano_publicacao' => 1964, 'paginas' => 208, 'genero' => 'Romance', 'disponivel' => true],

            // Jorge Amado
            ['titulo' => 'Dona Flor e Seus Dois Maridos', 'autor_id' => $jorgeId, 'ano_publicacao' => 1966, 'paginas' => 544, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'Capitães da Areia', 'autor_id' => $jorgeId, 'ano_publicacao' => 1937, 'paginas' => 336, 'genero' => 'Romance', 'disponivel' => false],
            ['titulo' => 'Gabriela, Cravo e Canela', 'autor_id' => $jorgeId, 'ano_publicacao' => 1958, 'paginas' => 672, 'genero' => 'Romance', 'disponivel' => true],

            // Carlos Drummond de Andrade
            ['titulo' => 'Alguma Poesia', 'autor_id' => $drummondId, 'ano_publicacao' => 1930, 'paginas' => 120, 'genero' => 'Poesia', 'disponivel' => true],
            ['titulo' => 'A Rosa do Povo', 'autor_id' => $drummondId, 'ano_publicacao' => 1945, 'paginas' => 168, 'genero' => 'Poesia', 'disponivel' => true],

            // Cecília Meireles
            ['titulo' => 'Viagem', 'autor_id' => $ceciliaId, 'ano_publicacao' => 1939, 'paginas' => 96, 'genero' => 'Poesia', 'disponivel' => true],
            ['titulo' => 'Vaga Música', 'autor_id' => $ceciliaId, 'ano_publicacao' => 1942, 'paginas' => 112, 'genero' => 'Poesia', 'disponivel' => false],

            // Lima Barreto
            ['titulo' => 'O Triste Fim de Policarpo Quaresma', 'autor_id' => $limaId, 'ano_publicacao' => 1915, 'paginas' => 272, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'Clara dos Anjos', 'autor_id' => $limaId, 'ano_publicacao' => 1948, 'paginas' => 224, 'genero' => 'Romance', 'disponivel' => true],

            // Guimarães Rosa
            ['titulo' => 'Grande Sertão: Veredas', 'autor_id' => $rosaId, 'ano_publicacao' => 1956, 'paginas' => 624, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'Sagarana', 'autor_id' => $rosaId, 'ano_publicacao' => 1946, 'paginas' => 368, 'genero' => 'Contos', 'disponivel' => false],

            // Rachel de Queiroz
            ['titulo' => 'O Quinze', 'autor_id' => $rachelId, 'ano_publicacao' => 1930, 'paginas' => 192, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'As Três Marias', 'autor_id' => $rachelId, 'ano_publicacao' => 1939, 'paginas' => 288, 'genero' => 'Romance', 'disponivel' => true],

            // José Saramago
            ['titulo' => 'Ensaio sobre a Cegueira', 'autor_id' => $saramagoId, 'ano_publicacao' => 1995, 'paginas' => 352, 'genero' => 'Romance', 'disponivel' => true],
            ['titulo' => 'O Evangelho Segundo Jesus Cristo', 'autor_id' => $saramagoId, 'ano_publicacao' => 1991, 'paginas' => 512, 'genero' => 'Romance', 'disponivel' => true],

            // Fernando Pessoa
            ['titulo' => 'Mensagem', 'autor_id' => $pessoaId, 'ano_publicacao' => 1934, 'paginas' => 96, 'genero' => 'Poesia', 'disponivel' => false],
            ['titulo' => 'Livro do Desassossego', 'autor_id' => $pessoaId, 'ano_publicacao' => 1982, 'paginas' => 544, 'genero' => 'Prosa', 'disponivel' => true],
        ];

        foreach ($books as $bookData) {
            Book::create($bookData);
        }
    }
}