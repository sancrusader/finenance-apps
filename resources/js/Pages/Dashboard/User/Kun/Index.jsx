import React, { useState, useRef, useEffect } from "react";
import { router,Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";
import UserLayout from "@/Layouts/UserLayout";
import Webcam from "react-webcam";

export default function ReceiptScanner() {
    const [imageSrc, setImageSrc] = useState(null);
    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 720,
        height: 1280,
        facingMode: "environment",
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
                    const previewUrl = URL.createObjectURL(blob); // Buat URL sementara
                    setImageSrc({ blob, previewUrl }); // Simpan blob dan URL
                }, "image/jpeg");
            };
        }
    };

    // Fungsi untuk menangani upload file melalui input
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // Buat URL sementara
            setImageSrc({ blob: file, previewUrl }); // Simpan file dan URL
        }
    };

    // Fungsi untuk mengunggah gambar ke server
    const uploadImage = () => {
        if (imageSrc?.blob) {
            const formData = new FormData();
            formData.append("image", imageSrc.blob, "receipt.jpg"); // Unggah blob
            router.post(route("kun.store"), formData);
        }
    };

    // Bersihkan URL sementara ketika komponen di-unmount
    useEffect(() => {
        return () => {
            if (imageSrc?.previewUrl) {
                URL.revokeObjectURL(imageSrc.previewUrl);
            }
        };
    }, [imageSrc]);

    return (
        <UserLayout>
          <Head title="Nota" />
            <div className="max-w-md mx-auto space-y-4 p-4">
                {/* Area preview atau webcam */}
                <div
                    className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner"
                    style={{ aspectRatio: "9/16" }}
                >
                    {!imageSrc?.previewUrl ? (
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
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={captureImage} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Ambil Gambar
                    </Button>
                    <Button
                        onClick={() =>
                            document.getElementById("fileInput").click()
                        }
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
                    disabled={!imageSrc}
                    className="w-full"
                >
                    Unggah Nota
                </Button>
            </div>
        </UserLayout>
    );
}
