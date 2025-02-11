<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Abl extends Model
{
    use HasFactory;

    protected $table = 'abl_nota';

    protected $fillable = [
        'name',
        'nama_toko',
        'tanggal',
        'deskripsi',
        'budget_code',
        'nomor_fr',
        'nominal',
    ];
}
