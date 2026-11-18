import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectMediaModal = ({ isOpen, onClose, type, data, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[150] backdrop-blur-md p-4 overflow-hidden">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-[160] bg-white/10 p-3 rounded-full transition-all hover:bg-white/20 active:scale-95"
      >
        <span className="text-xl px-1">✕</span>
      </button>

      <div className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center">
        {/* Header/Title */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
            <h3 className="text-white text-2xl font-black uppercase tracking-wider">{title}</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                Viewing {type === 'photo' ? 'Gallery' : 'Videos'} • {data?.length || 0} Items
            </p>
        </div>
        
        <div className="w-full flex-1 flex items-center justify-center relative">
          {type === 'photo' ? (
            <>
              {/* Navigation Arrows */}
              {data.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-4 lg:-left-16 text-white bg-white/5 hover:bg-white/15 p-5 rounded-full transition-all z-20 border border-white/10 backdrop-blur-sm"
                  >
                    <span className="text-2xl">←</span>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-4 lg:-right-16 text-white bg-white/5 hover:bg-white/15 p-5 rounded-full transition-all z-20 border border-white/10 backdrop-blur-sm"
                  >
                    <span className="text-2xl">→</span>
                  </button>
                </>
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative group"
                >
                  <img
                    src={data[currentIndex]}
                    alt={`Project preview ${currentIndex + 1}`}
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                  />
                  
                  {/* Counter Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-black bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 tracking-widest">
                    {currentIndex + 1} / {data.length}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Thumbnail strip */}
              {data.length > 1 && (
                <div className="absolute -bottom-12 flex gap-2 overflow-x-auto max-w-full p-2">
                    {data.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all overflow-hidden flex-shrink-0 ${currentIndex === idx ? 'border-[#069ab7] scale-110 shadow-lg shadow-[#069ab7]/30' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
              )}
            </>
          ) : (
             <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
                {data.length > 0 ? (
                    data.map((video, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative group"
                        >
                            <div className="aspect-video bg-black flex items-center justify-center">
                                <video 
                                    controls 
                                    className="w-full h-full" 
                                    src={video}
                                    poster={data[0]} // Using first photo as poster if available? No, this is video array.
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="p-4 bg-black/40 backdrop-blur-sm flex justify-between items-center border-t border-white/5">
                                <span className="text-white text-xs font-bold tracking-widest uppercase opacity-60">Project Video #{idx + 1}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-white text-center py-20 opacity-50">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-xl font-bold">No videos available</p>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectMediaModal;
