<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 255);
            $table->foreignId('autor_id')->constrained('authors')->onDelete('restrict');
            $table->integer('ano_publicacao')->nullable();
            $table->integer('paginas')->nullable();
            $table->string('genero', 100)->nullable();
            $table->boolean('disponivel')->default(true);
            $table->timestamps();
            
            // Índice único para título + autor_id (um autor não pode ter livros com título duplicado)
            $table->unique(['titulo', 'autor_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
}