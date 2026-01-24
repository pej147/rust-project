"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <>
      <Header title="Intel Map" subtitle="Track je vijanden" />
      <div className="p-4">
        <Card variant="elevated">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-zinc-800 p-4">
              <svg
                className="h-12 w-12 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">
              Nog geen map sessie
            </h2>
            <p className="mb-6 text-center text-zinc-400">
              Start een nieuwe map sessie om markers toe te voegen
            </p>
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
              Nieuwe Map Sessie
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
