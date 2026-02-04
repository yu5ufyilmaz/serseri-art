'use client';

import Link from 'next/link';

type ShowcaseWork = {
    id: string | number;
    title: string;
    image_url: string | null;
    collection_tag?: string | null;
};

export default function ProductShowcase({ works }: { works: ShowcaseWork[] }) {
    if (works.length === 0) {
        return (
            <div className="mx-auto flex h-[280px] w-full max-w-[720px] items-center justify-center border border-[#cfcfcf] bg-[#f1f1f1] sm:h-[420px]">
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#6b6b6b] sm:text-[12px]">
                    koleksiyon boş
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[720px]">
            <div className="overflow-x-auto pb-3">
                <div className="flex h-[320px] min-w-max border border-[#cfcfcf] bg-white sm:h-[430px]">
                    {works.map((work) => (
                        <Link
                            key={work.id}
                            href={`/eser/${work.id}`}
                            className="group relative h-full w-[56px] shrink-0 border-r border-[#dadada] last:border-r-0 sm:w-[68px]"
                            title={work.title}
                        >
                            {work.image_url ? (
                                <img
                                    src={work.image_url}
                                    alt={work.title}
                                    className="h-full w-full object-cover transition group-hover:brightness-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#d4d4d4] text-[10px] uppercase tracking-[0.16em] text-[#666]">
                                    görsel yok
                                </div>
                            )}

                            <span className="absolute left-1 top-1 bg-[#c8c8c8]/80 px-1.5 py-0.5 text-[10px] leading-none text-white">
                                yeni
                            </span>

                            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                {(work.collection_tag || 'seçki').slice(0, 16)}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="h-[6px] w-full rounded-full bg-[#d2d2d2]">
                <div className="h-full w-[28%] rounded-full bg-[#b7b7b7]"></div>
            </div>
        </div>
    );
}
