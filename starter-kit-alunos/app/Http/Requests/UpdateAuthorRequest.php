<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAuthorRequest extends FormRequest
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
        return [
            'nome' => 'sometimes|required|string|min:2|max:255',
            'bio' => 'nullable|string|max:1000',
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
            'nome.required' => 'O campo nome é obrigatório.',
            'nome.string' => 'O campo nome deve ser uma string.',
            'nome.min' => 'O nome deve ter pelo menos 2 caracteres.',
            'nome.max' => 'O nome deve ter no máximo 255 caracteres.',
            'bio.string' => 'O campo bio deve ser uma string.',
            'bio.max' => 'A biografia deve ter no máximo 1000 caracteres.',
        ];
    }
}