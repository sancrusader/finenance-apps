<?php

namespace App\Http\Controllers\Kun;

use App\Models\Kun;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotaResource;
use Illuminate\Support\Facades\Auth;

class NotaController extends Controller
{
    public function index()
    {
        // Mengembalikan tampilan halaman dengan Inertia.js
        return Inertia::render('Dashboard/User/Kun/List', [
            // Mengirimkan data notaList ke frontend sebagai koleksi NotaResource
            'notaList' => NotaResource::collection(
                // Mengambil data dari model Kun, diurutkan dari yang terbaru, lalu dipaginasi 10 data per halaman
                Kun::latest()->paginate(10)
            ),
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|string',
            'nama_toko' => 'required|string',
            'deskripsi' => 'required|string',
            'nominal' => 'required|numeric',
            'budget_code' => 'required|string',
            'nomor_fr' => 'required|string',
            'images' => 'required|file|mimes:jpeg,png,jpg|max:2048', // Validasi gambar wajib ada
        ]);
    
        // Ambil user dari auth
        $user = Auth::user();
    
        // Simpan gambar
        if ($request->hasFile('images')) {
            $imagePath = $request->file('images')->store('nota', 'public'); 
        } else {
            return redirect()->back()->withErrors(['images' => 'Gambar wajib diunggah.']);
        }
    
        // Simpan data ke database
        Kun::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'tanggal' => $request->tanggal,
            'nama_toko' => $request->nama_toko,
            'deskripsi' => $request->deskripsi,
            'nominal' => $request->nominal,
            'budget_code' => $request->budget_code,
            'nomor_fr' => $request->nomor_fr,
            'images' => $imagePath, 
        ]);
    
        return redirect()->back()->with('message', 'Nota berhasil disimpan!');
    }
    
}
