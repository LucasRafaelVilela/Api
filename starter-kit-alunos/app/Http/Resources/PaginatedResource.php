<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginatedResource extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Verifica se o recurso é paginado
        if (method_exists($this->resource, 'currentPage')) {
            return [
                'data' => $this->collection,
                'meta' => [
                    'page' => $this->currentPage(),
                    'per_page' => $this->perPage(),
                    'total' => $this->total(),
                    'total_pages' => $this->lastPage(),
                ],
                'links' => [
                    'self' => $request->url() . '?' . http_build_query($request->query()),
                    'next' => $this->nextPageUrl(),
                    'prev' => $this->previousPageUrl(),
                ],
            ];
        }

        // Se não for paginado, retorna estrutura básica
        return [
            'data' => $this->collection,
            'meta' => [
                'page' => 1,
                'per_page' => count($this->collection),
                'total' => count($this->collection),
                'total_pages' => 1,
            ],
            'links' => [
                'self' => $request->url() . '?' . http_build_query($request->query()),
                'next' => null,
                'prev' => null,
            ],
        ];
    }
}