<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Nota extends Model
{
    use HasFactory;

    protected $table = 'nota';

    protected $fillable = [
        'nama_toko',
        'tanggal',
        'deskripsi',
        'budget_code',
        'nomor_fr',
        'nominal',
    ];

    
}
