import { BrandLogo } from '@/components/brand-logos';
import { FileText, Layout, MessageSquare, Presentation } from 'lucide-react';

const logoBadge =
  'w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center p-2';

export function InfogiphUseCases() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#484848] mb-16 text-center">
          Use cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Presentations */}
          <div className="bg-[#FCF1E6] rounded-3xl p-10 flex flex-col justify-between min-h-[400px] border border-orange-50 group hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-[#484848]">
                  Presentations
                </span>
              </div>
              <p className="text-[#484848] text-lg font-medium">
                Make impactful slides
              </p>
            </div>

            {/* Mock Visual */}
            <div className="mt-8 relative">
              <div className="w-full h-48 bg-white/60 rounded-xl shadow-sm border border-orange-100 flex items-center justify-center">
                <Presentation className="w-16 h-16 text-[#DD6B20] opacity-50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Integration logos */}
              <div className="absolute -bottom-4 right-4 flex space-x-2">
                <div className={logoBadge}>
                  <BrandLogo
                    slug="google-slides"
                    name="Google Slides"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={logoBadge}>
                  <BrandLogo
                    slug="microsoft-powerpoint"
                    name="Microsoft PowerPoint"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blogs */}
          <div className="bg-[#F3EBF9] rounded-3xl p-10 flex flex-col justify-between min-h-[400px] border border-purple-50 group hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-[#484848]">Blog</span>
              </div>
              <p className="text-[#484848] text-lg font-medium">
                Leave an impression
              </p>
            </div>

            {/* Mock Visual */}
            <div className="mt-8 relative">
              <div className="w-full h-48 bg-white/60 rounded-xl shadow-sm border border-purple-100 flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-[#9F7AEA] opacity-50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Integration logos */}
              <div className="absolute -bottom-4 right-4 flex space-x-2">
                <div className={logoBadge}>
                  <BrandLogo
                    slug="medium"
                    name="Medium"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-[#EBF7E6] rounded-3xl p-10 flex flex-col justify-between min-h-[400px] border border-green-50 group hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-[#484848]">
                  Social Media
                </span>
              </div>
              <p className="text-[#484848] text-lg font-medium">
                Engage your audience
              </p>
            </div>

            {/* Mock Visual */}
            <div className="mt-8 relative">
              <div className="w-full h-48 bg-white/60 rounded-xl shadow-sm border border-green-100 flex items-center justify-center">
                <Layout className="w-16 h-16 text-[#48BB78] opacity-50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Integration logos */}
              <div className="absolute -bottom-4 right-4 flex space-x-2">
                <div className={logoBadge}>
                  <BrandLogo
                    slug="linkedin"
                    name="LinkedIn"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={logoBadge}>
                  <BrandLogo
                    slug="x"
                    name="X"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Docs */}
          <div className="bg-[#E1F4FD] rounded-3xl p-10 flex flex-col justify-between min-h-[400px] border border-blue-50 group hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-[#484848]">Docs</span>
              </div>
              <p className="text-[#484848] text-lg font-medium">
                Write easy to read docs
              </p>
            </div>

            {/* Mock Visual */}
            <div className="mt-8 relative">
              <div className="w-full h-48 bg-white/60 rounded-xl shadow-sm border border-blue-100 flex items-center justify-center">
                <FileText className="w-16 h-16 text-[#4299E1] opacity-50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Integration logos */}
              <div className="absolute -bottom-4 right-4 flex space-x-2">
                <div className={logoBadge}>
                  <BrandLogo
                    slug="notion"
                    name="Notion"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
