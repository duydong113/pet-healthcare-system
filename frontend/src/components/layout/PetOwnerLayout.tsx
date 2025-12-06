'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  FileText,
  Receipt,
  LogOut,
  User,
  Menu,
  X,
  Phone,
} from 'lucide-react';

const ownerMenuItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/owner/dashboard' },
  { icon: PawPrint, label: 'My Pets', href: '/owner/pets' },
  { icon: Calendar, label: 'Appointments', href: '/owner/appointments' },
  { icon: FileText, label: 'Records', href: '/owner/medical-records' },
  { icon: Receipt, label: 'Invoices', href: '/owner/invoices' },
  // { icon: User, label: 'Profile', href: '/owner/profile' },
];

export default function PetOwnerLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== 'owner') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Top Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg'
            : 'bg-white/80 backdrop-blur-md shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/owner/dashboard" className="flex items-center gap-3 group">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                🐾
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  VNUPet
                </h1>
                <p className="text-xs text-gray-500 font-medium">Pet's Lover</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {ownerMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Phone */}
              <a
                href="tel:384-129-293-39"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Phone size={18} />
                <span className="hidden xl:inline">384-129-293-39</span>
              </a>

              {/* User Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500">Pet Owner</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/owner/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} className="text-gray-600" />
                      <span className="text-gray-700 font-medium">My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pb-6 space-y-2 bg-white/95 backdrop-blur-lg border-t border-gray-200">
            {/* User Info Mobile */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl mt-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.full_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Menu Items Mobile */}
            {ownerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Phone Mobile */}
            <a
              href="tel:0972344865"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-xl font-semibold shadow-lg"
            >
              <Phone size={20} />
              <span>0972344865</span>
            </a> 

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
            {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-orange-50 via-pink-50 to-orange-50 border-t border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand + Subscribe */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🐾</span>
                <span className="text-2xl font-bold">
                  <span className="text-gray-900">VNU</span>
                  <span className="text-orange-500">Pet</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Keep track of your pet&apos;s health, appointments and records in one
                friendly place.
              </p>

 <form
  onSubmit={(e) => e.preventDefault()}
  className="flex bg-white/90 rounded-full shadow-lg max-w-md overflow-hidden"
>

  {/* Input chiếm 50% */}
  <input
    type="email"
    placeholder="Email address"
    className="w-1/2 px-4 py-3 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
  />

  {/* Button chiếm 50%, bo cả bên trái */}
  <button
    type="submit"
    className="
      w-1/2 py-3 text-sm font-semibold text-white 
      bg-gradient-to-r from-orange-400 to-pink-500 
      hover:from-orange-500 hover:to-pink-600 
      transition-all whitespace-nowrap text-center
      rounded-l-full          /* 👈 bo góc bên trái */
      "
  >
    Subscribe
  </button>
</form>



            </div>

            {/* Address */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Address
              </h3>
              <p className="text-sm text-gray-600">+84 036-722-8955</p>
              <p className="text-sm text-gray-600">support@vnupet.com</p>
              <p className="text-sm text-gray-600 mt-2">
                1 VNU Street, Cau Giay<br />
                Ha Noi, Viet Nam
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Links
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500">Grooming</a></li>
                <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500">Terms</a></li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Opening Hours
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Mon–Tue: 09:00–18:00</li>
                <li>Wed: 09:00–18:00</li>
                <li>Thu–Fri: 09:00–18:00</li>
                <li>Sat: 10:00–17:00</li>
                <li>Sun: 10:00–16:00</li>
              </ul>
            </div>
          </div>

          {/* Bottom mini line */}
          <div className="mt-8 flex items-center justify-between text-[11px] sm:text-xs text-gray-500">
            <span>© 2025 VNUPet. All rights reserved.</span>
            <span className="hidden sm:inline">Made with ❤️ for every pet & pet lover.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}