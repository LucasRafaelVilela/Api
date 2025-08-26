<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $currentYear = date('Y');
        $bookId = $this->route('book'); // Assume que o ID vem da rota
        
        return [
            'titulo' => [
                'sometimes',
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('books', 'titulo')->where(function ($query) {
                    return $query->where('autor_id', $this->input('autor_id'));
                })->ignore($bookId)
            ],
            'autor_id' => 'sometimes|required|integer|exists:authors,id',
            'ano_publicacao' => "nullable|integer|min:1450|max:{$currentYear}",
            'paginas' => 'nullable|integer|min:1',
            'genero' => 'nullable|string|max:100',
            'disponivel' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'titulo.required' => 'O campo titulo é obrigatório.',
            'titulo.string' => 'O campo titulo deve ser uma string.',
            'titulo.min' => 'O título deve ter pelo menos 2 caracteres.',
            'titulo.max' => 'O título deve ter no máximo 255 caracteres.',
            'titulo.unique' => 'Já existe um livro com este título para o mesmo autor.',
            'autor_id.required' => 'O campo autor_id é obrigatório.',
            'autor_id.integer' => 'O campo autor_id deve ser um número inteiro.',
            'autor_id.exists' => 'O autor informado não existe.',
            'ano_publicacao.integer' => 'O ano de publicação deve ser um número inteiro.',
            'ano_publicacao.min' => 'O ano de publicação deve ser no mínimo 1450.',
            'ano_publicacao.max' => 'O ano de publicação não pode ser futuro.',
            'paginas.integer' => 'O número de páginas deve ser um número inteiro.',
            'paginas.min' => 'O número de páginas deve ser pelo menos 1.',
            'genero.string' => 'O campo gênero deve ser uma string.',
            'genero.max' => 'O gênero deve ter no máximo 100 caracteres.',
            'disponivel.boolean' => 'O campo disponível deve ser verdadeiro ou falso.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $errors = $validator->errors()->toArray();
        
        // Verifica se houve erro de duplicidade título+autor
        if (isset($errors['titulo']) && 
            in_array('Já existe um livro com este título para o mesmo autor.', $errors['titulo'])) {
            
            $response = response()->json([
                'message' => 'Já existe um livro com este título para o mesmo autor.',
                'status' => 409,
                'errors' => $errors
            ], 409);
            
            throw new \Illuminate\Http\Exceptions\HttpResponseException($response);
        }
        
        parent::failedValidation($validator);
    }
}