import React, { JSX } from "react";

export default function DeliveryStatus(): JSX.Element {
    return (
        <div className="w-[1039px] h-[486px] relative">
            {/* Title */}
            <div className="left-[262px] top-0 absolute text-center justify-start text-[#4d53d2] text-[32px] font-bold font-['Poppins']">
                Keterangan Status Pengiriman
            </div>

            {/* Background Container */}
            <div className="w-[1039px] h-[399px] left-0 top-[87px] absolute bg-gradient-to-r from-[#4d53d2] to-[#303564] rounded-[20px]">

                {/* Suspended Status */}
                <div className="w-[120px] h-[27px] left-[44px] top-[22px] absolute bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
                <div className="w-[107px] left-[50px] top-[25px] absolute text-center justify-start text-[#b51b1b] text-sm font-bold font-['Poppins'] leading-tight">
                    Ditangguhkan
                </div>
                <div className="w-[945px] left-[51px] top-[66px] absolute justify-start text-white text-base font-bold font-['Poppins']">
                    <ul className="list-disc list-inside">
                        <li>
                            Pembayaran tidak masuk/jumlah uang tidak sesuai (kurang). Kontak Whatsapp berikut untuk pengaduan (085123123123)
                        </li>
                        <li>
                            Penerima tidak ada, harap mengambil barang Anda di toko
                        </li>
                        <li>
                            Penerima tidak mempunyai galon untuk di tukarkan, sediakan galon atau membayar biaya galon baru
                        </li>
                        <li>
                            Penerima menolak barang yang dikirim, silahkan datang ke toko apabila ingin me-refund biaya (tanpa ongkir)
                        </li>
                    </ul>
                </div>

                {/* Completed Status */}
                <div className="w-[120px] h-[27px] left-[44px] top-[213px] absolute bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
                <div className="w-[107px] left-[50px] top-[216px] absolute text-center justify-start text-[#1bb54e] text-sm font-bold font-['Poppins'] leading-tight">
                    Selesai
                </div>
                <div className="w-[945px] left-[51px] top-[257px] absolute justify-start text-white text-base font-bold font-['Poppins']">
                    Pengiriman selesai dengan penerima telah menerima barang
                </div>

                {/* In Delivery Status */}
                <div className="w-40 h-[27px] left-[44px] top-[308px] absolute bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
                <div className="w-[142.67px] left-[53px] top-[311px] absolute text-center justify-start text-[#b7b108] text-sm font-bold font-['Poppins'] leading-tight">
                    Dalam Pengiriman
                </div>
                <div className="w-[945px] left-[51px] top-[352px] absolute justify-start text-white text-base font-bold font-['Poppins']">
                    Barang sedang dalam proses pengiriman, pastikan Anda mengetahui sesi pengiriman toko
                </div>
            </div>
        </div>
    );
}