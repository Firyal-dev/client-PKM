import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dinonaktifkan - Puskesmas",
    description: "Website dinonaktifkan sementara",
};

export default function SuspendedPage({
    searchParams,
}: {
    searchParams: { message?: string }
}) {
    const message = searchParams.message || "Website ini dinonaktifkan sementara.";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
            <div className="text-center p-8 max-w-lg">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Website Dinonaktifkan
                </h1>

                {/* Message */}
                <p className="text-gray-600 text-lg mb-8">
                    {message}
                </p>

                {/* Info Box */}
                <div className="bg-white rounded-lg shadow-md p-6 text-left">
                    <h3 className="font-semibold text-gray-700 mb-2">
                        ℹ️ Informasi
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Untuk informasi lebih lanjut, silakan hubungi administrator
                        atau coba lagi nanti.
                    </p>
                </div>

                {/* Back link */}
                <div className="mt-8">
                    <a
                        href="/"
                        className="text-red-600 hover:text-red-800 underline"
                    >
                        Klik di sini untuk memuat ulang halaman
                    </a>
                </div>
            </div>
        </div>
    );
}
