<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'autor_id' => $this->autor_id,
            'autor' => $this->when($this->relationLoaded('author'), function () {
                return [
                    'id' => $this->author->id,
                    'nome' => $this->author->nome
                ];
            }),
            'ano_publicacao' => $this->ano_publicacao,
            'paginas' => $this->paginas,
            'genero' => $this->genero,
            'disponivel' => $this->disponivel,
            'criado_em' => $this->created_at->toISOString(),
            'atualizado_em' => $this->updated_at->toISOString(),
        ];
    }
}