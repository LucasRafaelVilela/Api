<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'bio',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [];

    /**
     * Relacionamento com livros
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'autor_id');
    }

    /**
     * Accessor para formatar nome da tabela criado_em/atualizado_em
     * Para compatibilidade com frontend que espera esses nomes
     */
    public function getCriadoEmAttribute()
    {
        return $this->created_at;
    }

    public function getAtualizadoEmAttribute()
    {
        return $this->updated_at;
    }

    /**
     * Scope para buscar autores por nome
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('nome', 'like', "%{$term}%");
    }

    /**
     * Scope para ordenação
     */
    public function scopeOrderBy($query, $field = 'nome', $direction = 'asc')
    {
        $allowedFields = ['nome', 'created_at', 'updated_at'];
        $field = in_array($field, $allowedFields) ? $field : 'nome';
        $direction = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'asc';
        
        return $query->orderBy($field, $direction);
    }
}