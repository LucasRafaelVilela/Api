<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use App\Models\Author;
use App\Models\Book;

// TODO: Implementar suas rotas aqui

/*
 * 📋 Rotas esperadas após implementação:
 * 
 * Autores:
 * GET    /authors              - Listar autores (index)
 * POST   /authors              - Criar autor (store) 
 * GET    /authors/{id}         - Buscar autor (show)
 * PUT    /authors/{id}         - Atualizar autor (update)
 * DELETE /authors/{id}         - Excluir autor (destroy)
 * GET    /authors/{id}/books   - Livros do autor (books)
 * 
 * Livros:
 * GET    /books                - Listar livros (index)
 * POST   /books                - Criar livro (store)
 * GET    /books/{id}           - Buscar livro (show) 
 * PUT    /books/{id}           - Atualizar livro (update)
 * DELETE /books/{id}           - Excluir livro (destroy)
 */

// Routes for Authors
Route::get('/authors', function () {
    return Author::all();
});

Route::post('/authors', function (Request $request) {
    try {
        $validatedData = $request->validate(
            [
                'nome' => 'required|string|min:3|max:255',
                'bio'  => 'nullable|string|max:250',
            ],
            [
                'nome.required' => 'O campo nome é obrigatório',
                'nome.string'   => 'O campo nome deve ser uma string',
                'nome.min'      => 'O campo nome deve ter pelo menos 3 caracteres',
                'nome.max'      => 'O campo nome deve ter no máximo 255 caracteres',
                'bio.string'    => 'O campo bio deve ser uma string',
                'bio.max'       => 'O campo bio deve ter no máximo 250 caracteres',
            ]
        );

        $author = Author::create($validatedData);

        return response()->json([
            'message' => 'Autor criado com sucesso',
            'data'    => $author
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'status' => 422,
            'errors' => $e->errors()
        ], 422);
    }
});

Route::get('/authors/{id}', function ($id) {
    $author = Author::find($id);

    if (!$author) {
        return response()->json([
            'status' => 404,
            'message' => 'Autor não encontrado'
        ], 404);
    }

    return response()->json([
        'status' => 200,
        'data' => $author
    ], 200);
});

Route::put('/authors/{id}', function (Request $request, $id) {
    $author = Author::findOrFail($id);
    $author->update($request->all());
    return response()->json($author, 200);
});

Route::delete('/authors/{id}', function ($id) {
    $author = Author::find($id);

    if (!$author) {
        return response()->json([
            'status' => 404,
            'message' => 'Autor não encontrado'
        ], 404);
    }

    if ($author->books()->exists()) {
        return response()->json([
            'status' => 409,
            'message' => 'Não é possível excluir autor que possui livros associados'
        ], 409);
    }

    try {
        $author->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Autor excluído com sucesso'
        ], 200);

    } catch (QueryException $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Erro ao tentar excluir autor'
        ], 500);
    }
});

Route::get('/authors/{id}/books', function ($id) {
    $author = Author::findOrFail($id);
    $books = $author->books;
    return response()->json($books, 200);
});

// Routes for Books
Route::get('/books', function () {
    return Book::all();
});

Route::post('/books', function (Request $request) {
    $book = Book::create($request->all());
    return response()->json($book, 201);
});

Route::get('/books/{id}', function ($id) {
    return Book::findOrFail($id);
});

Route::put('/books/{id}', function (Request $request, $id) {
    try {
        $book = Book::findOrFail($id);

        $validatedData = $request->validate(
            [
                'titulo' => 'required|string|min:3|max:255',
                'autor_id' => 'required|integer',
                'ano_publicacao' => 'required|integer',
                'paginas' => 'required|integer',
                'genero' => 'required|string|max:255',
                'disponivel' => 'required|boolean',
            ],
            [
                'titulo.required' => 'O campo título é obrigatório',
                'titulo.string' => 'O título deve ser uma string',
                'titulo.min' => 'O título deve ter pelo menos 3 caracteres',
                'titulo.max' => 'O título deve ter no máximo 255 caracteres',
                'autor_id.required' => 'O autor é obrigatório',
                'autor_id.integer' => 'O autor deve ser um número válido',
                'ano_publicacao.required' => 'O ano de publicação é obrigatório',
                'ano_publicacao.integer' => 'O ano de publicação deve ser um número',
                'paginas.required' => 'O número de páginas é obrigatório',
                'paginas.integer' => 'O número de páginas deve ser um número',
                'genero.required' => 'O gênero é obrigatório',
                'genero.string' => 'O gênero deve ser uma string',
                'genero.max' => 'O gênero deve ter no máximo 255 caracteres',
                'disponivel.required' => 'O campo disponível é obrigatório',
                'disponivel.boolean' => 'O campo disponível deve ser verdadeiro ou falso',
            ]
        );

        $book->update($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'Livro atualizado com sucesso',
            'data' => $book
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'status' => 422,
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Erro ao atualizar o livro',
            'error' => $e->getMessage()
        ], 500);
    }
});


Route::delete('/books/{id}', function ($id) {
    $book = Book::findOrFail($id);
    $book->delete();
    return response()->json(null, 204);
});