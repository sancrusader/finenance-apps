<?php

namespace App\Http\Controllers\Kun;

use App\Http\Controllers\Controller;
use App\Models\Nota;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotaController extends Controller
{
    public function index(){

        $nota = Nota::paginate(10);

        return Inertia::render('Dashboard/User/Kun/Nota/Index',[
            'nota' => $nota
        ]);
    }
}
