'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "FlowChart AI has revolutionized how we document our processes. What used to take hours now takes minutes. The AI understands exactly what we need.",
    rating: 5,
    useCase: "Process Documentation"
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Architect",
    company: "DevCorp",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "The quality of flowcharts generated is incredible. Our team uses it for system architecture diagrams and it's become an essential tool in our workflow.",
    rating: 5,
    useCase: "System Architecture"
  },
  {
    name: "Emily Watson",
    role: "Business Analyst",
    company: "InnovateCo",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "Perfect for creating user journey maps and business process flows. The AI suggestions are spot-on and save us so much time in client presentations.",
    rating: 5,
    useCase: "Business Analysis"
  },
  {
    name: "David Kim",
    role: "UX Designer",
    company: "DesignStudio",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "As a designer, I love how clean and professional the output looks. It integrates perfectly into our design system and client deliverables.",
    rating: 5,
    useCase: "UX Design"
  },
  {
    name: "Lisa Thompson",
    role: "Operations Director",
    company: "LogiFlow",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    content: "We've streamlined our entire operations documentation with FlowChart AI. The team adoption was instant because it's so intuitive to use.",
    rating: 5,
    useCase: "Operations"
  },
  {
    name: "James Park",
    role: "Startup Founder",
    company: "NextGen AI",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    content: "Essential for pitch decks and investor presentations. The professional quality helps us communicate complex ideas clearly to stakeholders.",
    rating: 5,
    useCase: "Presentations"
  }
];

const useCases = [
  {
    title: "Business Process Mapping",
    description: "Document workflows, procedures, and operational processes",
    icon: "🏢",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Software Development",
    description: "Create system architectures, user flows, and technical diagrams",
    icon: "💻",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Education & Training",
    description: "Build learning materials, course structures, and knowledge maps",
    icon: "📚",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Project Management",
    description: "Visualize project timelines, dependencies, and deliverables",
    icon: "📊",
    color: "from-orange-500 to-red-500"
  }
];

export default function ModernTestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 dark:from-blue-800/5 dark:to-purple-800/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
            Perfect for every use case
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From startups to enterprises, see how teams across industries use FlowChart AI
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Loved by thousands of users
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join the community of professionals who've transformed their workflow with FlowChart AI
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 h-full">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-blue-500 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Use case badge */}
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {testimonial.useCase}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join thousands of happy users
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
