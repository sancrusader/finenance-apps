import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader } from "lucide-react";
import UserLayout from "@/Layouts/UserLayout";
import Webcam from "react-webcam";
import { usePage } from "@inertiajs/react";
import { toast, Toaster } from "sonner";
import { Label } from "@/Components/ui/label";

export default function ReceiptScanner() {
    const user = usePage().props.auth.user;
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        tanggal: "",
        nama_toko: "",
        deskripsi: "",
        nominal: "",
        budget_code: "",
        nomor_fr: "",
    });
    const [cameraPermission, setCameraPermission] = useState("prompt"); // Menyimpan status izin kamera
    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 720,
        height: 1280,
        facingMode: "environment",
    };

    useEffect(() => {
        // Cek izin kamera saat pertama kali load
        navigator.permissions
            .query({ name: "camera" })
            .then((result) => {
                setCameraPermission(result.state);
                result.onchange = () => setCameraPermission(result.state);
            })
            .catch(() => setCameraPermission("prompt")); // Jika tidak didukung, tetap "prompt"
    }, []);

    const requestCameraAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission("granted");
        } catch (error) {
            setCameraPermission("denied");
            toast.error("Akses kamera ditolak", {
                description: "Silakan izinkan akses kamera di pengaturan browser.",
            });
        }
    };

    const captureImage = () => {
        const image = webcamRef.current.getScreenshot();
        if (image) {
            const img = new Image();
            img.src = image;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 720;
                canvas.height = 1280;
                const context = canvas.getContext("2d");

                const scale = Math.min(img.width / 720, img.height / 1280);
                const x = (img.width - 720 * scale) / 2;
                const y = (img.height - 1280 * scale) / 2;

                context.drawImage(
                    img,
                    x,
                    y,
                    720 * scale,
                    1280 * scale,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                canvas.toBlob((blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setImageSrc({ blob, previewUrl });
                }, "image/jpeg");
            };
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImageSrc({ blob: file, previewUrl });
        }
    };

    const uploadImage = async () => {
        if (imageSrc?.blob) {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("image", imageSrc.blob, "receipt.jpg");

            try {
                const response = await axios.post(route("kun.store"), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.data && response.data.data) {
                    setFormData({
                        tanggal: response.data.data.tanggal || "",
                        nama_toko: response.data.data.nama_toko || "",
                        deskripsi: response.data.data.deskripsi || "",
                        nominal: response.data.data.nominal || "",
                        budget_code: response.data.data.budget_code || "",
                        nomor_fr: response.data.data.nomor_fr || "",
                    });

                    // Tampilkan toast sukses
                    toast.success("Analisis berhasil!", {
                        description: "Data berhasil diekstrak dari gambar.",
                    });
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Gagal mengunggah gambar", {
                    description: "Terjadi kesalahan saat mengirim gambar.",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (imageSrc?.previewUrl) {
                URL.revokeObjectURL(imageSrc.previewUrl);
            }
        };
    }, [imageSrc]);

    // Kirim ke back end
    const submitForm = (e) => {
        e.preventDefault();
        post(route("nota.store"));
    };

    return (
        <UserLayout>
            <Head title="Nota" />
            <Toaster position="top-center" />
            <div className="max-w-md mx-auto space-y-4 p-4">
                {/* Area preview atau webcam */}
                <div
                    className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner"
                    style={{ aspectRatio: "9/16" }}
                >
                    {cameraPermission === "granted" ? (
                        !imageSrc?.previewUrl ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={imageSrc.previewUrl || "/placeholder.svg"}
                                alt="Captured receipt"
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Button onClick={requestCameraAccess} className="bg-red-500">
                                Izinkan Akses Kamera
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={captureImage} disabled={cameraPermission !== "granted"} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Ambil Gambar
                    </Button>
                    <Button
                        onClick={() => document.getElementById("fileInput").click()}
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Unggah Gambar
                    </Button>
                </div>

                <Input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <Button
                    onClick={uploadImage}
                    disabled={!imageSrc || isLoading}
                    className="w-full flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah...
                        </>
                    ) : (
                        "Unggah Nota"
                    )}
                </Button>

                {/* Form yang otomatis terisi */}
                <div className="mt-4 space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                        className="mb-4"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama"
                        id="name"
                    />
                    <Label htmlFor="name">Tanggal</Label>
                    <Input
                        type="text"
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        placeholder="Tanggal"
                        id="tanggal"
                    />
                    <Label htmlFor="nama_toko">Nama Toko</Label>
                    <Input
                        type="text"
                        value={formData.nama_toko}
                        onChange={(e) => setFormData({ ...formData, nama_toko: e.target.value })}
                        placeholder="Nama Toko"
                        id="nama_toko"
                    />
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Input
                        type="text"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                        placeholder="Deskripsi"
                        id="deskripsi"
                    />
                    <Label htmlFor="nominal">Nominal</Label>
                    <Input
                        type="text"
                        value={formData.nominal}
                        onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                        placeholder="Nominal"
                        id="nominal"
                    />
                    <Label htmlFor="bg_code">Budget Code</Label>
                    <Input
                        type="text"
                        value={formData.budget_code}
                        onChange={(e) => setFormData({ ...formData, budget_code: e.target.value })}
                        placeholder="Budget Code"
                        id="bg_code"
                    />
                    <Label htmlFor="nomor_fr">Nomor FR</Label>
                    <Input
                        type="text"
                        value={formData.nomor_fr}
                        onChange={(e) => setFormData({ ...formData, nomor_fr: e.target.value })}
                        placeholder="Nomor FR"
                        id="nomor_fr"
                    />
                </div>

                <Button
                    onClick={submitForm}
                    disabled={isLoading}
                    className="w-full mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim Data...
                        </>
                    ) : (
                        "Kirim Data"
                    )}
                </Button>
            </div>
        </UserLayout>
    );
}
