<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kun extends Model
{
    use HasFactory;

    protected $table = 'nota_kun';

    protected $fillable = [
        'uuid',
        'user_id',
        'name',
        'nama_toko',
        'tanggal',
        'deskripsi',
        'budget_code',
        'nomor_fr',
        'nominal',
        'images'
    ];

    protected static function boot()
    {
        parent::boot();

        // Secara otomatis menghasilkan UUID saat data dibuat
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
