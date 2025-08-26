<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $authors = [
            [
                'nome' => 'Machado de Assis',
                'bio' => 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado por muitos críticos, estudiosos, escritores e leitores como o maior nome da literatura brasileira.',
            ],
            [
                'nome' => 'Clarice Lispector',
                'bio' => 'Clarice Lispector foi uma escritora e jornalista brasileira nascida na Ucrânia. Autora de romances, contos e ensaios, é considerada uma das escritoras brasileiras mais importantes do século XX.',
            ],
            [
                'nome' => 'Jorge Amado',
                'bio' => 'Jorge Amado foi um dos mais famosos e traduzidos escritores brasileiros de todos os tempos. Autor de obras como Dona Flor e Seus Dois Maridos e O Cortiço.',
            ],
            [
                'nome' => 'Carlos Drummond de Andrade',
                'bio' => 'Carlos Drummond de Andrade foi um poeta, farmacêutico, contista e cronista brasileiro, considerado por muitos o mais influente poeta brasileiro do século XX.',
            ],
            [
                'nome' => 'Cecília Meireles',
                'bio' => 'Cecília Meireles foi uma poetisa, pintora, jornalista e professora brasileira. É considerada uma das vozes líricas mais importantes da literatura em língua portuguesa.',
            ],
            [
                'nome' => 'Lima Barreto',
                'bio' => 'Afonso Henriques de Lima Barreto foi um escritor brasileiro. Autor de O Triste Fim de Policarpo Quaresma, é considerado um precursor do Modernismo no Brasil.',
            ],
            [
                'nome' => 'Guimarães Rosa',
                'bio' => 'João Guimarães Rosa foi um escritor brasileiro, considerado um dos maiores escritores da literatura universal do século XX. Autor de Grande Sertão: Veredas.',
            ],
            [
                'nome' => 'Rachel de Queiroz',
                'bio' => 'Rachel de Queiroz foi uma escritora, jornalista, cronista e tradutora brasileira. Foi a primeira mulher a ingressar na Academia Brasileira de Letras.',
            ],
            [
                'nome' => 'José Saramago',
                'bio' => 'José Saramago foi um escritor português, ganhador do Prêmio Nobel de Literatura de 1998. Autor de obras como Ensaio sobre a Cegueira.',
            ],
            [
                'nome' => 'Fernando Pessoa',
                'bio' => 'Fernando Pessoa foi um poeta, escritor, publicitário, astrólogo, crítico literário, inventor, empresário, tradutor, correspondente comercial, filosófo e comentarista político português.',
            ],
        ];

        foreach ($authors as $authorData) {
            Author::create($authorData);
        }
    }
}