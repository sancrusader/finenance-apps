import { Head, usePage } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout";

export default function AdminDashboard(){
    const user = usePage().props.auth.user;

    return(
        <>
        <Head title="Admin Dashboard" />
            <h1>Dashboard Admin {user.name}</h1>
        </>
    )
}