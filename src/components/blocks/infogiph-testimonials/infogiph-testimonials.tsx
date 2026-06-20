'use client';

import { BRAND_SLUG_BY_NAME, BrandLogo } from '@/components/brand-logos';
import { ChevronLeft, ChevronRight, Star, Sun } from 'lucide-react';
import { useState } from 'react';
import {
  GALLERY_DIAGRAMS,
  GalleryDiagram,
  OrgChartDiagram,
} from './gallery-diagram';

const TESTIMONIALS = [
  {
    quote:
      'I describe a system in one sentence and Infogiph hands me a clean, animated diagram. It cut my deck prep from an hour to about five minutes.',
    author: 'Sarah J.',
    role: 'Product Marketing',
    company: 'Spotify',
  },
  {
    quote:
      'We drop Infogiph diagrams straight into our RFCs and Notion docs. No more fighting with boxes and arrows in slides.',
    author: 'David L.',
    role: 'Senior Product Manager',
    company: 'Atlassian',
  },
  {
    quote:
      'Type the architecture, get a diagram I would actually ship to customers. The GIF and MP4 exports are perfect for launch posts.',
    author: 'Emily R.',
    role: 'Developer Advocate',
    company: 'Stripe',
  },
];

export function InfogiphTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  return (
    <section className="w-full py-24 bg-[#FAF9F6] border-y border-gray-100">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Gallery Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3">
            <Sun className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#484848]">
              Made with Infogiph
            </h2>
          </div>
          <p className="mt-3 text-base text-gray-500 max-w-xl">
            Real, animated diagrams generated from a single sentence — the kind
            of thing teams ship to docs, decks, and launch posts every day.
          </p>
        </div>

        {/* Gallery Grid - Animated Infographic Diagrams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-32">
          {GALLERY_DIAGRAMS.map((diagram) => (
            <div
              key={diagram.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <GalleryDiagram
                data={diagram.data}
                accentColor={diagram.accentColor}
                label={diagram.label}
              />
            </div>
          ))}
          {/* Org Chart Diagram */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto min-h-64 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <OrgChartDiagram />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-[#484848] mb-16 relative inline-block">
            Don't take our{' '}
            <span className="relative">
              word
              {/* Wavy underline */}
              <svg
                className="absolute w-full h-3 -bottom-2 left-0 text-gray-300"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q 25 20, 50 10 T 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </span>{' '}
            for it.
          </h2>

          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100 relative mt-8">
            {/* Slider Controls */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center min-h-[160px] justify-center transition-opacity duration-300">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                "{TESTIMONIALS[currentIndex].quote}"
              </p>
              <div className="flex flex-col items-center">
                {BRAND_SLUG_BY_NAME[TESTIMONIALS[currentIndex].company] && (
                  <BrandLogo
                    slug={
                      BRAND_SLUG_BY_NAME[TESTIMONIALS[currentIndex].company]
                    }
                    name={TESTIMONIALS[currentIndex].company}
                    decorative
                    className="h-6 w-auto mb-3"
                  />
                )}
                <h4 className="font-bold text-gray-900">
                  {TESTIMONIALS[currentIndex].author}
                </h4>
                <p className="text-gray-500 text-sm">
                  {TESTIMONIALS[currentIndex].role} ·{' '}
                  <span className="font-medium text-gray-700">
                    {TESTIMONIALS[currentIndex].company}
                  </span>
                </p>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.author}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={
                    'h-2 rounded-full transition-all ' +
                    (i === currentIndex
                      ? 'w-6 bg-gray-800'
                      : 'w-2 bg-gray-300 hover:bg-gray-400')
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product stat strip */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-y-8 sm:grid-cols-4">
          {[
            { value: '5–15s', label: 'to generate' },
            { value: '4', label: 'export formats' },
            { value: '7', label: 'starter templates' },
            { value: '100%', label: 'editable' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#484848]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
