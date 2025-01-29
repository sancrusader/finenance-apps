import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Info, X } from 'lucide-react';

const useFlashToast = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        // Menampilkan pesan sukses
        if (flash.success) {
            toast(flash.success, {
                icon: <Info className="h-5 w-5 text-green-500" />,
                type: "success", // Tipe success
            });
        }

        // Menampilkan pesan error
        if (flash.error) {
            toast(flash.error, {
                icon: <X className="h-5 w-5 text-red-500" />,
                type: "error", // Tipe error
            });
        }
    }, [flash.success, flash.error]);
};

export default useFlashToast;