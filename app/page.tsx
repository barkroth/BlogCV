"use client";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Modal from "./components/modal";
import axios from "axios";
import { yorumEkle } from "@/lib/yorumekle";
import { firestore } from "../lib/firebase";
import { getYorumlar } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function () {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("Japonya");
  const filteredPhotos = useMemo(
    () => photos.filter((photo) => photo.country === selectedCountry),
    [photos, selectedCountry]
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  // YorumlariçinStateler
  const [adSoyad, setAdSoyad] = useState("");
  const [yorumMetni, setYorumMetni] = useState("");
  const [yükleniyor, setYükleniyor] = useState(false);
  const [yorumlar, setYorumlar] = useState<any[]>([]);

  const formuGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYükleniyor(true);
    try {
      await yorumEkle(adSoyad, yorumMetni);
      alert("Yorum başarıyla eklendi!");
      setAdSoyad("");
      setYorumMetni("");

      const guncelYorumlar = await getYorumlar();
      setYorumlar(guncelYorumlar);
    } catch (hata) {
      alert("Yorum eklenirken bir hata oluştu.");
    } finally {
      setYükleniyor(false);
    }
  };

  useEffect(() => {
    const yorumlariGetir = async () => {
      const yorumdatası = await getYorumlar();
      setYorumlar(yorumdatası);
    };

    yorumlariGetir();
  }, []);

  const getPhotos = async (country?: string) => {
    setLoading(true);
    try {
      const url = country
        ? `/api/photos?country=${encodeURIComponent(country)}`
        : "/api/photos";

      const response = await axios.get(url);
      setPhotos(response.data);
    } catch (error) {
      console.error("Fotoğraflar yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  const handleCountryClick = async (country: string) => {
    await getPhotos(country);
    setIsModalOpen(true);
  };

  const handlePhotoClick = (photo: any) => {
    console.log("Tıklanan fotoğraf:", photo);
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    // containerDiv
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* mainDiv */}
      <div>
        {/* Dön buraya. Responsive olacak bu div   */}
        <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md fixed top-0 left-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent focus:outline-none hover:bg-gray-100 cursor-pointer"
              >
                MD Blog
              </button>
            </div>
            {/* MAsaüstü Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Ülkeler Dropdownu */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-orange-400 transition-colors py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <span className="text-base">Ülkeler</span>
                  <svg
                    className="w-4 h-4 group-hover:text-orange-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleCountryClick("Japonya")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      Japonya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountryClick("Sırbistan")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      Sırbistan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountryClick("İspanya")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      İspanya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountryClick("İtalya")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      İtalya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountryClick("Rusya")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      Rusya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountryClick("Karadağ")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-400 hover:text-white rounded-lg transition-colors"
                    >
                      Karadağ
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="text-base text-gray-800 hover:text-orange-400 transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const el = document.getElementById("hakkimda");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Hakkımda
              </button>
              <button
                type="button"
                className="text-base text-gray-800 hover:text-orange-400 transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const el = document.getElementById("iletisim");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                İletişim
              </button>
            </div>
            {/* Hamburger Icon */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-gray-800 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menüyü Aç/Kapat"
            >
              <span
                className={`block w-6 h-0.5 bg-gray-800 mb-1 transition-all ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-gray-800 mb-1 transition-all ${
                  menuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-gray-800 transition-all ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
          {/* Mobil Menüsü */}
          <div
            className={`md:hidden bg-white/95 border-t border-gray-200 transition-all duration-300 overflow-hidden ${
              menuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0"
            }`}
          >
            <div className="flex flex-col items-start px-6 space-y-2">
              {/* Ülkeler Dropdown Mobil */}
              <div className="w-full">
                <button
                  className="flex items-center space-x-2 text-gray-800 hover:text-orange-400 w-full py-2"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <span>Ülkeler</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`pl-4 flex flex-col gap-1 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleCountryClick("Japonya")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    Japonya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryClick("Sırbistan")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    Sırbistan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryClick("İspanya")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    İspanya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryClick("İtalya")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    İtalya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryClick("Rusya")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    Rusya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryClick("Karadağ")}
                    className="text-gray-800 hover:text-orange-400 py-1 w-full text-left"
                  >
                    Karadağ
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-800 hover:text-orange-400 py-2"
                onClick={() => {
                  const el = document.getElementById("hakkimda");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Hakkımda
              </button>
              <button
                type="button"
                className="text-gray-800 hover:text-orange-400 py-2"
                onClick={() => {
                  const el = document.getElementById("iletisim");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                İletişim
              </button>
            </div>
          </div>
        </nav>
        {/* Navbar boşluğu için padding hala düzenlenebilir. Bitince dönüp bir bak */}
        <div className="pt-20" />
        {/* FotoğrafSayfasıDivi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-10 pl-26 py-15 mx-auto container">
          {/* Japonya Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("Japonya")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              Japonya
            </h1>
            <img
              src="/images/japonya75.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
          {/* Sırbistan Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("Sırbistan")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              Sırbistan
            </h1>
            <img
              src="/images/Sırbistan6.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
          {/* İspanya Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("İspanya")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              İspanya
            </h1>
            <img
              src="/images/barcelona1.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
          {/* İtalya Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("İtalya")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              İtalya
            </h1>
            <img
              src="/images/roma-italya2.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
          {/* Rusya Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("Rusya")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              Rusya
            </h1>
            <img
              src="/images/rusya1.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
          {/* Karadağ Div */}
          <div
            className="bg-white shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer rounded-xl"
            onClick={() => handleCountryClick("Karadağ")}
          >
            <h1 className="text-xl font-semibold mb-2 text-gray-800 text-center mt-2">
              Karadağ
            </h1>
            <img
              src="/images/karadağ1.jpeg"
              alt=""
              className="object-cover rounded-bl-xl rounded-br-xl"
            />
          </div>
        </div>
        {/* Yorumlar Alanı Olacak */}
        <div className="mt-16 space-y-8 px-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-black">
            Yorumlar
          </h2>
          <h2 className="text-xl font-semibold mb-4 text-black">Yorum Yaz</h2>
          <form onSubmit={formuGonder} className="space-y-4">
            <input
              type="text"
              placeholder="Ad Soyad Giriniz"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              className="w-full border rounded p-2 text-black"
              required
            />
            <textarea
              placeholder="Yorumunuzu Giriniz"
              value={yorumMetni}
              onChange={(e) => setYorumMetni(e.target.value)}
              className="w-full border rounded p-2 h-24 text-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={yükleniyor}
            >
              {yükleniyor ? "Gönderiliyor..." : "Yorumu Gönder"}
            </button>
          </form>

          <div className="p-3 border border-gray-200 rounded-lg shadow bg-white hover:shadow-xl transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">Yorumlar</h2>
              <ul>
                {yorumlar.map((yorum, index) => (
                  <li
                    key={index}
                    className="mb-2 p-2 bg-white text-black rounded border-b border-gray-300 last:border-b-0"
                  >
                    <p>
                      <strong>{yorum.adSoyad}</strong>:
                    </p>
                    <p>{yorum.yorumMetni}</p>
                    <p className="text-sm text-gray-500">
                      {yorum.olusturulmaTarihi
                        ?.toDate()
                        .toLocaleString("tr-TR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FooterDiv */}
        <footer className="bg-white/90 text-gray-800 py-12 mt-20 border-t border-gray-200">
          <div className="container mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Hakkımda kısmı */}
              <div className="space-y-4">
                <h3
                  id="hakkimda"
                  className="text-xl font-semibold text-orange-500"
                >
                  Hakkımda
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Merhaba! Ben Mehmet Deviren. <br /> Makine mühendisliğinden
                  web geliştirme dünyasına adım atmış bir mühendisim. Kod
                  yazmayı ve yeni teknolojiler keşfetmeyi tutkuyla seviyor, aynı
                  zamanda objektifimle dünyanın dört bir yanına bakmaktan büyük
                  keyif alıyorum. <br /> Bu blogda Japonya, Sırbistan, İspanya,
                  İtalya, Rusya ve Karadağ seyahatlerimde çektiğim kareleri
                  sizlerle paylaşmak istiyorum. Projelerimde React, Next.js ve
                  Tailwind CSS'in yanı sıra, etkileşimli 3D carousel'ler için
                  Swiper gibi teknolojiler kullanarak hem estetik hem de
                  performans odaklı çözümler geliştiriyorum. <br /> İspanya'dan
                  Japonya'ya uzanan bu blog, hem satırlarımı hem de anılarımı
                  taşıyor.
                </p>
              </div>

              {/* Hızlı linkler olacak */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-orange-500">
                  Hızlı Bağlantılar
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                  >
                    Ana Sayfa
                  </a>
                  <a className="text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Hakkımda
                  </a>
                  <a className="text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    İletişim
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                  >
                    Ülkeler
                  </a>
                </div>
              </div>

              {/* İletişim Linkleri gelecek buraya */}
              <div className="space-y-4">
                <h3
                  id="iletisim"
                  className="text-xl font-semibold text-orange-500"
                >
                  Sosyal Medya
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/barkroth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 p-3 rounded-full hover:bg-orange-400 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/h.mehmetdeviren/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 p-3 rounded-full hover:bg-orange-400 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/mehmet-deviren-0999381a1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 p-3 rounded-full hover:bg-orange-400 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:mehmetdeviren1@hotmail.com"
                    className="bg-gray-200 p-3 rounded-full hover:bg-orange-400 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 mt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              © 2025 Mehmet'in Objektifinden. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </div>
      {/* modal çağrısı olacak burada ve tıklanınca slider için ekran açılacak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Modal onClose={closeModal}>
            <div className="w-full h-[80vh] flex items-center justify-center p-4 bg-white/95 rounded-xl shadow-2xl">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : photos.length > 0 ? (
                <Swiper
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={"auto"}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={true}
                  navigation={true}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="w-full h-[80vh] flex items-center justify-center relative"
                >
                  {photos.map((photo, index) => (
                    <SwiperSlide
                      key={index}
                      className="flex items-center justify-center px-4 h-[80vh] w-full"
                    >
                      <img
                        src={photo.img}
                        alt={`${photo.country} - ${index + 1}`}
                        className="max-h-[75vh] max-w-[85vw] object-contain rounded-xl shadow-2xl border-4 border-white/20 mx-auto block"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex justify-center items-center h-[400px]">
                  <p className="text-xl text-gray-600">Fotoğraf bulunamadı</p>
                </div>
              )}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
