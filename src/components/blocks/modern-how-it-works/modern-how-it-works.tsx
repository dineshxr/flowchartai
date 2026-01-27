'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  MessageSquare, 
  Zap, 
  Download, 
  ArrowRight,
  Sparkles,
  Wand2
} from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Idea",
    description: "Simply type what you want to create in natural language. Our AI understands complex processes and workflows.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI Magic Happens",
    description: "Our advanced AI processes your description and intelligently creates a professional flowchart structure.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Customize & Refine",
    description: "Edit, style, and perfect your flowchart with our intuitive editor. Add colors, change layouts, and more.",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
  },
  {
    number: "04",
    icon: Download,
    title: "Export & Share",
    description: "Download in multiple formats or share with your team. Perfect for presentations, documentation, and more.",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
  }
];

export default function ModernHowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <motion.div
          style={{ y }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/10 dark:to-purple-800/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
            From idea to flowchart
            <br />
            in 4 simple steps
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our streamlined process makes creating professional flowcharts effortless. 
            No design skills required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
                    <span className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 shadow-lg`}>
                      <step.icon className="w-full h-full text-white" />
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </motion.div>
              </div>

              {/* Visual */}
              <div className="flex-1 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className={`w-80 h-80 rounded-3xl bg-gradient-to-br ${step.bgColor} border border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden`}>
                    {/* Animated elements inside each step */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${step.color} opacity-20`}
                      />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                        className={`w-20 h-20 rounded-xl bg-gradient-to-br ${step.color} p-5 shadow-lg`}
                      >
                        <step.icon className="w-full h-full text-white" />
                      </motion.div>
                    </div>

                    {/* Floating particles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`}
                        animate={{
                          x: [0, 50, 0],
                          y: [0, -30, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.8,
                          ease: "easeInOut"
                        }}
                        style={{
                          left: `${20 + i * 20}%`,
                          top: `${60 + i * 10}%`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Arrow connector (except for last step) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                  className="absolute left-1/2 transform -translate-x-1/2 mt-96 lg:mt-0 lg:left-auto lg:right-0 lg:transform-none"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
