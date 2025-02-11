import { useState } from "react";
import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/Components/ui/table";
import { Search, FilePlus } from "lucide-react";

export default function NotaList({ notaList }) {
    const listNota = Array.isArray(notaList?.data) ? notaList.data : [];
    const [searchTerm, setSearchTerm] = useState("");
    const filteredNota = listNota.filter(
        (nota) =>
            nota.nama_toko.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nota.tanggal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout header="Daftar Nota">
            <Head title="Daftar Nota" />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari Nama Toko / Nominal / Tanggal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[300px]"
                        />
                    </div>
                </div>

                {/* Tabel Nota */}
                <Table>
                    <TableCaption>Daftar nota yang telah dibuat</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Toko</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Budget Code</TableHead>
                            <TableHead>Nomor Fr</TableHead>
                            <TableHead>Gambar Nota</TableHead>
                            <TableHead>Nominal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNota.length > 0 ? (
                            filteredNota.map((nota, index) => (
                                <TableRow key={nota.uuid}>
                                    <TableCell className="font-bold">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>{nota.nama_toko}</TableCell>
                                    <TableCell>{nota.tanggal}</TableCell>
                                    <TableCell>{nota.deskripsi}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`/storage/${nota.images}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Gambar Nota
                                        </a>
                                    </TableCell>
                                    <TableCell>{nota.budget_code}</TableCell>
                                    <TableCell>{nota.nomor_fr}</TableCell>
                                    <TableCell>{nota.nominal}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-gray-500"
                                >
                                    Tidak ada data yang ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7}>Total</TableCell>
                            <TableCell className="text-right">
                                $2,500.00
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </UserLayout>
    );
}
