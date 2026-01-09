import React from "react";
import {
  ChevronLeft,
  Calendar,
  BookOpen,
  User,
  Hash,
  FileText,
  Building2,
  Clock,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-100 p-4">
      {/* Grid wrapper */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Design 1: Card Overlap */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b">
            <p className="font-semibold">Card Overlap</p>
          </div>
          <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
            <button className="mb-4 p-2 bg-white rounded-full shadow-md">
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>

            <div className="relative mb-32">
              <div className="w-48 h-72 mx-auto rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                  Cover
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 -mt-24 relative">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                De Alchemist
              </h1>
              <p className="text-purple-600 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Paulo Coelho
              </p>

              <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-xl p-3 mb-4">
                <p className="text-sm text-gray-600 mb-1">Leesstatus</p>
                <p className="font-semibold text-green-700">Aan het lezen</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 mb-1">Startdatum</p>
                  <p className="font-semibold text-purple-700">01/01/2026</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 mb-1">Einddatum</p>
                  <p className="font-semibold text-pink-700">-</p>
                </div>
              </div>

              <button className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl py-3 font-semibold mb-4">
                Markeer als uitgelezen
              </button>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Beschrijving</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Een inspirerend verhaal over een jonge herder die op zoek gaat
                    naar zijn persoonlijke legende...
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                    Fictie
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Filosofie
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                    Avontuur
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">Pagina's</p>
                      <p className="text-sm font-semibold">197</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <div>
                      <p className="text-xs text-gray-500">Jaar</p>
                      <p className="text-sm font-semibold">1988</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">ISBN</p>
                      <p className="text-sm font-semibold">978-0062315</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Uitgever</p>
                      <p className="text-sm font-semibold">HarperOne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design 2: Gradient Header */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b">
            <p className="font-semibold">Gradient Header</p>
          </div>
          <div className="min-h-screen bg-gray-50">
            <div className="bg-linear-to-br from-violet-400 via-fuchsia-400 to-pink-400 px-4 pt-4 pb-32 rounded-b-3xl">
              <button className="mb-4 p-2 bg-white/30 backdrop-blur-sm rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex gap-4 items-start">
                <div className="w-32 h-48 rounded-xl shadow-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shrink-0">
                  Cover
                </div>
                <div className="flex-1 text-white pt-2">
                  <h1 className="text-2xl font-bold mb-2">De Alchemist</h1>
                  <p className="opacity-90 mb-3">Paulo Coelho</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
                      Fictie
                    </span>
                    <span className="bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
                      Filosofie
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 -mt-24">
              <div className="bg-white rounded-2xl shadow-xl p-5 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="bg-linear-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Aan het lezen
                  </span>
                </div>

                <div className="flex gap-3 mb-3">
                  <div className="flex-1 bg-violet-50 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Start</p>
                    <p className="font-semibold text-violet-700 text-sm">
                      01/01/26
                    </p>
                  </div>
                  <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Eind</p>
                    <p className="font-semibold text-pink-700 text-sm">-</p>
                  </div>
                </div>

                <button className="w-full bg-linear-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl py-3 font-semibold">
                  Uitgelezen ✓
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-5 mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Over dit boek</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Een inspirerend verhaal over een jonge herder die op zoek gaat
                  naar zijn persoonlijke legende en daarbij leert over het volgen
                  van je dromen...
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Pagina's</span>
                    <span className="font-semibold">197</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Uitgiftejaar</span>
                    <span className="font-semibold">1988</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Uitgever</span>
                    <span className="font-semibold">HarperOne</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">ISBN</span>
                    <span className="font-semibold text-xs">978-0062315</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design 3: Minimalist Clean */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b">
            <p className="font-semibold">Minimalist Clean</p>
          </div>
          <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 p-4">
            <button className="mb-6 p-2">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
              <div className="w-40 h-60 mx-auto rounded-2xl bg-linear-to-br from-indigo-300 to-purple-300 shadow-lg mb-6 flex items-center justify-center text-white font-bold">
                Cover
              </div>

              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  De Alchemist
                </h1>
                <p className="text-indigo-600 font-medium">Paulo Coelho</p>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Leesstatus</span>
                  <select className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full font-semibold border-none outline-none">
                    <option>Aan het lezen</option>
                    <option>Gelezen</option>
                    <option>Wil nog lezen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-indigo-50 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-1">Startdatum</p>
                  <p className="font-bold text-indigo-700">01/01/2026</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-1">Einddatum</p>
                  <p className="font-bold text-purple-700">-</p>
                </div>
              </div>

              <button className="w-full bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-2xl py-4 font-bold shadow-lg">
                Markeer als uitgelezen
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">Beschrijving</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Een inspirerend verhaal over een jonge herder die op zoek gaat
                naar zijn persoonlijke legende en daarbij belangrijke levenslessen
                leert...
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">Genres</h3>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Fictie
                </span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Filosofie
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                  Avontuur
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Paginas</p>
                  <p className="font-bold text-gray-800">197</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Uitgiftejaar</p>
                  <p className="font-bold text-gray-800">1988</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Uitgever</p>
                  <p className="font-bold text-gray-800">HarperOne</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ISBN</p>
                  <p className="font-bold text-gray-800 text-xs">978-0062315</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design 4: Book Shelf */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b">
            <p className="font-semibold">Book Shelf</p>
          </div>
          <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
            <div className="bg-linear-to-r from-amber-400 to-orange-400 p-4 shadow-md">
              <button className="mb-3 p-2 bg-white/30 backdrop-blur-sm rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-white text-xl font-bold">Boek Details</h2>
            </div>

            <div className="p-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border-4 border-amber-200">
                <div className="flex gap-4 mb-4">
                  <div className="w-28 h-40 rounded-lg bg-linear-to-br from-amber-300 to-orange-300 shadow-md flex items-center justify-center text-white font-bold shrink-0">
                    Cover
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      De Alchemist
                    </h1>
                    <p className="text-orange-600 mb-2">Paulo Coelho</p>
                    <div className="flex gap-1 flex-wrap">
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">
                        Fictie
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        Filosofie
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Status</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Aan het lezen
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Start: </span>
                      <span className="font-semibold">01/01/26</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Eind: </span>
                      <span className="font-semibold">-</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl py-3 font-bold shadow-md mb-4">
                  ✓ Boek Uitgelezen
                </button>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Beschrijving
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Een inspirerend verhaal over een jonge herder die op zoek gaat
                    naar zijn persoonlijke legende...
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Boek Informatie
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">📖 Paginas</span>
                      <span className="font-semibold">197</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">📅 Jaar</span>
                      <span className="font-semibold">1988</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">🏢 Uitgever</span>
                      <span className="font-semibold">HarperOne</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">#️⃣ ISBN</span>
                      <span className="font-semibold text-xs">978-0062315</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design 5: Modern Cards */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b">
            <p className="font-semibold">Modern Cards</p>
          </div>
          <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
            <div className="flex justify-between items-center mb-6">
              <button className="p-2 bg-white rounded-xl shadow-md">
                <ChevronLeft className="w-6 h-6 text-blue-600" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">Boek Details</h2>
              <div className="w-10"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-4">
              <div className="bg-linear-to-r from-cyan-400 to-blue-400 p-6 pb-20">
                <div className="w-44 h-64 mx-auto rounded-xl shadow-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl">
                  Cover
                </div>
              </div>

              <div className="px-6 -mt-12 pb-6">
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    De Alchemist
                  </h1>
                  <p className="text-blue-600 mb-3">Paulo Coelho</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-xs font-medium">
                      Fictie
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                      Filosofie
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-medium">
                      Avontuur
                    </span>
                  </div>
                </div>

                <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl p-5 mb-4 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800">Leesstatus</span>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">
                      Aan het lezen
                    </span>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Startdatum</p>
                      <p className="font-bold text-green-700">01/01/2026</p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Einddatum</p>
                      <p className="font-bold text-gray-400">-</p>
                    </div>
                  </div>

                  <button className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl py-3 font-bold shadow-md">
                    Markeer als uitgelezen
                  </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">Over dit boek</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Een inspirerend verhaal over een jonge herder die op zoek gaat
                    naar zijn persoonlijke legende en leert over het belang van
                    dromen volgen...
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-800 mb-3">Boek Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Paginas</p>
                      <p className="font-bold text-cyan-600">197</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Jaar</p>
                      <p className="font-bold text-blue-600">1988</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Uitgever</p>
                      <p className="font-bold text-indigo-600 text-sm">
                        HarperOne
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">ISBN</p>
                      <p className="font-bold text-purple-600 text-xs">
                        978-0062315
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: quick note */}
      <p className="mt-6 text-sm text-neutral-600">
        Tip: als je ze écht strak “naast elkaar” wilt zonder dat elke design een
        volledige pagina-hoogte pakt, vervang in elk design{" "}
        <code className="px-1 py-0.5 bg-neutral-200 rounded">min-h-screen</code>{" "}
        door{" "}
        <code className="px-1 py-0.5 bg-neutral-200 rounded">
          min-h-[700px]
        </code>{" "}
        (of wat jij fijn vindt).
      </p>
    </div>
  );
}