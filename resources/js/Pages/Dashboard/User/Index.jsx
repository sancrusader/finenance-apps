import { Head,usePage } from "@inertiajs/react"
import UserLayout from "@/Layouts/UserLayout"

export default function UserDashboard(){

    const user = usePage().props.auth.user
    return (
        <UserLayout>
            <Head title="Dashboard" />
            <h1>Selamat Datang {user.name}</h1>
        </UserLayout>
    )
}