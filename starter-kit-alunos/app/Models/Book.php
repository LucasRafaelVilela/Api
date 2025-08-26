<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'autor_id',
        'ano_publicacao',
        'paginas',
        'genero',
        'disponivel',
    ];

    protected $casts = [
        'disponivel' => 'boolean',
        'ano_publicacao' => 'integer',
        'paginas' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [];

    /**
     * Relacionamento com autor
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'autor_id');
    }

    /**
     * Accessor para incluir dados do autor quando necessário
     */
    public function getAutorAttribute()
    {
        return $this->author ? [
            'id' => $this->author->id,
            'nome' => $this->author->nome
        ] : null;
    }

    /**
     * Accessors para formatar nome da tabela criado_em/atualizado_em
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
     * Scope para busca por título ou gênero
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('titulo', 'like', "%{$term}%")
              ->orWhere('genero', 'like', "%{$term}%");
        });
    }

    /**
     * Scope para filtrar por autor
     */
    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('autor_id', $authorId);
    }

    /**
     * Scope para filtrar por disponibilidade
     */
    public function scopeByAvailability($query, $disponivel)
    {
        return $query->where('disponivel', $disponivel);
    }

    /**
     * Scope para filtrar por faixa de anos
     */
    public function scopeByYearRange($query, $anoInicio = null, $anoFim = null)
    {
        if ($anoInicio) {
            $query->where('ano_publicacao', '>=', $anoInicio);
        }
        
        if ($anoFim) {
            $query->where('ano_publicacao', '<=', $anoFim);
        }
        
        return $query;
    }

    /**
     * Scope para ordenação
     */
    public function scopeOrderBy($query, $field = 'titulo', $direction = 'asc')
    {
        $allowedFields = ['titulo', 'ano_publicacao', 'paginas', 'created_at', 'updated_at'];
        $field = in_array($field, $allowedFields) ? $field : 'titulo';
        $direction = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'asc';
        
        return $query->orderBy($field, $direction);
    }
}