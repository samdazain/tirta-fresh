import React, { JSX } from 'react';

export default function DeliveryTerms(): JSX.Element {
    return (
        <div className="w-full max-w-[1039px] mx-auto px-4 py-8 space-y-6">
            {/* Title */}
            <h2
                className=" text-center text-[32px] font-bold font-poppins bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] bg-clip-text text-transparent "
            >
                Ketentuan Layanan Pesan Antar
            </h2>

            {/* Content Box */}
            <div className="bg-gradient-to-r from-[#4d53d2] to-[#303564] rounded-[20px] p-6 md:p-10">
                <div className="text-white text-base font-bold font-poppins space-y-6 leading-relaxed">
                    <div>
                        <strong>1. Alamat Tujuan Pengiriman</strong>
                        <br />• Pengiriman hanya tersedia untuk desa/dusun yang tercantum
                        pada pilihan alamat pengiriman. Pastikan Anda memilih alamat dengan
                        benar saat melakukan pemesanan.
                    </div>

                    <div>
                        <strong>2. Minimal Pembelian</strong>
                        <br />• Minimal total pembelian untuk dapat menggunakan layanan
                        pesan antar adalah Rp25.000.
                    </div>

                    <div>
                        <strong>3. Biaya Pengiriman</strong>
                        <br />• Biaya pengiriman tetap sebesar Rp5.000 (lima ribu rupiah)
                        untuk setiap alamat tujuan yang tersedia.
                    </div>

                    <div>
                        <strong>4. Pembayaran & Konfirmasi</strong>
                        <br />• Pengiriman hanya diproses setelah pembayaran dikonfirmasi,
                        dengan menyertakan bukti transfer yang dikirim melalui chat/admin
                        toko.
                    </div>

                    <div>
                        <strong>5. Jadwal Pengiriman</strong>
                        <br />
                        • Pengiriman dilakukan dalam dua sesi setiap harinya:
                        <br />
                        - Sesi 1: Pukul 11.00 WIB
                        <br />
                        - Sesi 2: Pukul 15.00 WIB
                        <br />• Pastikan pembayaran sudah dikonfirmasi maksimal 30 menit
                        sebelum jadwal pengiriman.
                    </div>

                    <div>
                        <strong>6. Ketentuan Jika Alamat Tidak Ditemukan</strong>
                        <br />• Jika alamat tidak ditemukan atau tidak ada respons saat
                        pengantaran, barang akan dikembalikan ke toko. Barang tidak akan
                        dikirim ulang, dan pelanggan harus mengambil sendiri pesanan di
                        toko. Saat pengambilan, pelanggan wajib menunjukkan bukti pembayaran
                        sebagai konfirmasi pesanan. Biaya pengiriman tidak dapat
                        dikembalikan jika barang tidak berhasil dikirim.
                    </div>

                    <div>
                        <strong>7. Catatan Tambahan</strong>
                        <br />• Pastikan nomor WhatsApp/telepon yang dicantumkan aktif saat
                        pengiriman. Tidak melayani pengiriman ke luar desa yang tersedia.
                    </div>
                </div>
            </div>
        </div>
    );
}
