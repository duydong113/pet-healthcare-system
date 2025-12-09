'use client';
import Image from 'next/image';

import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import {
  PawPrint,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Bot,
  CalendarHeart,
  FileText,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerAboutUsPage() {
  return (
    <PetOwnerLayout>
      <div className="space-y-12">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-3xl p-10 md:p-12 shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-300/40 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-purple-400/40 rounded-full blur-3xl" />
          <div className="absolute top-12 right-1/3 w-16 h-16 bg-pink-300/60 rounded-full blur-xl" />

          <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full mb-4">
                <PawPrint className="text-orange-500" size={18} />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  About PawPerfect
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Where Your Pet&apos;s
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                  Health Meets Technology
                </span>
              </h1>

              <p className="text-gray-700 text-base md:text-lg mb-6 max-w-xl">
                PawPerpect là hệ thống chăm sóc sức khỏe thú cưng được xây dựng để giúp bạn
                quản lý lịch hẹn, hồ sơ bệnh án và chi phí điều trị của thú cưng – tất cả
                trong một giao diện thân thiện, đầy màu sắc và dễ sử dụng.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/owner/appointments"
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/owner/medical-records"
                  className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm border border-gray-200"
                >
                  View Health Records
                </Link>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="relative">
  <div className="relative w-full max-w-md mx-auto">
    {/* Main image frame */}
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
  <Image
    src="/pet-dog.jpg"
    alt="Hero"
    fill
    className="object-cover"
    sizes="100vw"
    priority
  />
</div>


                {/* Floating small card */}
                <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 border border-orange-100">
                  <HeartPulse className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Daily Care</p>
                    <p className="text-sm font-semibold text-gray-800">
                      24/7 Support for Your Pets
                    </p>
                  </div>
                </div>

                {/* Floating small card 2 */}
                <div className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 border border-purple-100">
                  <Bot className="text-purple-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">PawPecfect AI Assistant</p>
                    <p className="text-sm font-semibold text-gray-800">Smart Pet Advice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & STORY */}
        <section className="grid gap-10 lg:grid-cols-2 items-start">
          {/* Text */}
          <div className="space-y-6">
            <div>
              <p className="text-orange-500 font-semibold mb-1 text-sm">
                Our Mission & Story
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Built for Pet Lovers, by Pet Lovers
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
             PawPerfect ra đời từ một câu hỏi rất đơn giản: &quot;Làm sao để chủ nuôi có
              thể theo dõi sức khỏe thú cưng một cách dễ dàng, minh bạch và hiện
              đại?&quot;. Thay vì phải nhớ từng lần khám, từng hóa đơn hay từng loại
              thuốc, chúng tôi muốn mọi thứ đều được lưu lại trong một hệ thống duy
              nhất.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Hệ thống được thiết kế với UI hiện đại, tông màu ấm áp và trải nghiệm
              thân thiện, giúp bạn cảm thấy như đang chăm sóc thú cưng trong một thế
              giới đầy yêu thương – chứ không phải một hệ thống quản lý khô khan.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cùng với đó, PawPerpect tích hợp trợ lý AI để hỗ trợ bạn đặt câu hỏi nhanh
              chóng về dinh dưỡng, hành vi, tiêm phòng hay các vấn đề thường gặp – tất
              nhiên chỉ mang tính tham khảo, không thay thế được bác sĩ thú y.
            </p>
          </div>

          {/* Image frame right */}
          <div className="space-y-4">
            {/* Big frame */}
           <div className="relative aspect-video rounded-3xl overflow-hidden bg-white border-2 border-dashed border-purple-200 shadow-xl">
    <Image
      src="/Cute-dog-breeds-that-make-the-best-pets-f.jpg"
      alt="Story Image"
      fill
      className="object-cover"
      sizes="(max-width:768px) 100vw, 50vw"
      priority
    />
  </div>


           
{/* Two small frames */}
<div className="grid grid-cols-2 gap-4">

  {/* Clinic / Facility Image */}
  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-orange-200 shadow-md">
    <Image
      src="/151-VET.jpg"
      alt="Clinic Facility"
      fill
     className="object-cover object-[center_25%]"
      sizes="(max-width:768px) 100vw, 50vw"
    />
  </div>

  {/* Team / Doctor Image */}
<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-pink-200 shadow-md">
  <Image
    src="/duy-doctor.png"
    alt="Doctor Team"
    fill
    className="object-cover object-[center_25%]"
    sizes="(max-width:768px) 100vw, 50vw"
  />
</div>

</div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-orange-500 font-semibold text-sm mb-1">
              What PawPerfect Brings to You
            </p>
            <h2 className="text-3xl font-bold text-gray-900">All-in-One Pet Care Hub</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm">
              Từ quản lý thú cưng, đặt lịch, lưu hồ sơ bệnh án đến theo dõi hóa đơn – tất
              cả đều được gom lại trong một dashboard trực quan và dễ sử dụng.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                <PawPrint className="text-blue-500" size={26} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">My Pets</h3>
              <p className="text-sm text-gray-600 mb-3">
                Quản lý thông tin từng thú cưng, giống loài, đặc điểm và tình trạng sức
                khỏe.
              </p>
              <Link
                href="/owner/pets"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Go to My Pets →
              </Link>
            </div>

            <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                <CalendarHeart className="text-orange-500" size={26} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Appointments</h3>
              <p className="text-sm text-gray-600 mb-3">
                Đặt lịch, chọn bác sĩ, chọn dịch vụ và xem các khung giờ trống dễ dàng.
              </p>
              <Link
                href="/owner/appointments"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                View Appointments →
              </Link>
            </div>

            <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="text-purple-500" size={26} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Medical Records
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Lưu trữ toàn bộ lịch sử khám, chẩn đoán, thuốc và phác đồ điều trị.
              </p>
              <Link
                href="/owner/medical-records"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Access Records →
              </Link>
            </div>

            <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                <Receipt className="text-green-500" size={26} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Invoices</h3>
              <p className="text-sm text-gray-600 mb-3">
                Theo dõi chi phí điều trị và hóa đơn một cách minh bạch, rõ ràng.
              </p>
              <Link
                href="/owner/invoices"
                className="text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Check Invoices →
              </Link>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-orange-500 font-semibold text-sm mb-1">Our Core Values</p>
            <h2 className="text-3xl font-bold text-gray-900">What We Believe In</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
                <HeartPulse className="text-orange-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Compassion First
              </h3>
              <p className="text-sm text-gray-600">
                Chúng tôi đặt tình yêu thương và sự thấu hiểu thú cưng ở vị trí trung
                tâm của mọi trải nghiệm.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                <ShieldCheck className="text-purple-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Safe & Transparent
              </h3>
              <p className="text-sm text-gray-600">
                Thông tin sức khỏe, lịch sử điều trị và chi phí đều rõ ràng, dễ theo dõi
                cho chủ nuôi.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center mb-3">
                <Sparkles className="text-pink-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Smart & Modern
              </h3>
              <p className="text-sm text-gray-600">
                Kết hợp UI hiện đại, trải nghiệm mượt mà và AI hỗ trợ để nâng tầm việc
                chăm sóc thú cưng.
              </p>
            </div>
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Ready to Give Your Pet a Better Healthcare Experience?
              </h3>
              <p className="text-blue-100 text-sm md:text-base">
                Đặt lịch khám, lưu hồ sơ sức khỏe và theo dõi chi phí – tất cả chỉ với
                vài cú nhấp chuột trong PawPerfect.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/owner/appointments"
                className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm flex items-center gap-2"
              >
                <CalendarHeart size={18} />
                Book an Appointment
              </Link>
              <Link
                href="/owner/pets"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold shadow-md hover:bg-white/25 transform hover:-translate-y-1 transition-all text-sm flex items-center gap-2"
              >
                <PawPrint size={18} />
                View My Pets
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PetOwnerLayout>
  );
}
