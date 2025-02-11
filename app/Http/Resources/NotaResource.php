<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'tanggal' => $this->tanggal,
            'nama_toko' => $this->nama_toko,
            'deskripsi' => $this->deskripsi,
            'budget_code' => $this->budget_code,
            'nomor_fr' => $this->nomor_fr,
            'nominal' => $this->nominal,
            'images' => $this->images,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
