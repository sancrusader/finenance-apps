<?php

namespace App\Http\Controllers\Kun;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class ExtractImageController extends Controller
{
    public function index(){
        return Inertia::render('Dashboard/User/Kun/Index');
    }

    public function analyzeImage(Request $request)
    {
        // Validasi file upload
        $request->validate([
            'image' => 'required|image|max:10240', // Maksimal 10MB
        ]);

        // Ambil file gambar yang diunggah
        $image = $request->file('image');

        // Encode gambar ke dalam format Base64
        $base64Image = base64_encode(file_get_contents($image->getPathname()));

        // URL API OpenAI
        $apiUrl = 'https://api.openai.com/v1/chat/completions';

        // Payload yang akan dikirim ke OpenAI API
        $payload = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'Analyze this  image and extract the following information:
                                - tanggal
                                - nama toko
                                - deskripsi
                                - nominal
                                - butget code / bc
                                - nomor fr
                                Present the extracted information in a JSON format with these fields as keys.',
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => 'data:image/jpeg;base64,' . $base64Image,
                            ],
                        ],
                    ],
                ],
            ],
            'max_tokens' => 300,
        ];

        // Kirim permintaan ke API OpenAI
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post($apiUrl, $payload);

        // Periksa jika ada kesalahan
        if ($response->failed()) {
            return response()->json([
                'error' => 'Failed to analyze the image.',
                'details' => $response->json(),
            ], $response->status());
        }

        // Return hasil analisis
        return response()->json($response->json());
    }
}
