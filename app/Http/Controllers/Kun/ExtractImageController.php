<?php

namespace App\Http\Controllers\Kun;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class ExtractImageController extends Controller
{
    // Kun Nota
    public function index(){
        return Inertia::render('Dashboard/User/Kun/Index');
    }

    // Analysis image with openAi
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
    
        // Payload untuk OpenAI API
        $payload = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'Analyze this image and extract the following information:
                                - tanggal (with format example 1 Maret 2025)
                                - nama toko
                                - deskripsi
                                - nominal (format decimal)
                                - budget code / bc
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
    
        // Periksa jika ada kesalahan dalam respons
        if ($response->failed()) {
            return response()->json([
                'error' => 'Failed to analyze the image.',
                'details' => $response->json(),
            ], $response->status());
        }
    
        // Ambil hanya bagian konten yang diperlukan
        $responseData = $response->json();
        $aiMessage = $responseData['choices'][0]['message']['content'] ?? null;
    
        // Gunakan regex untuk mengekstrak JSON dari teks
        preg_match('/```json\s*(\{.*?\})\s*```/s', $aiMessage, $matches);
    
        // Jika JSON ditemukan, kembalikan hanya JSON tersebut dengan pesan sukses
        if (!empty($matches[1])) {
            return response()->json([
                'success' => 'Image analyzed successfully.',
                'data' => json_decode($matches[1], true),
            ], 200);
        }
    
        // Jika tidak ditemukan JSON, kembalikan pesan error
        return response()->json([
            'error' => 'Failed to extract JSON',
            'raw_response' => $aiMessage
        ]);
    }
    
}
