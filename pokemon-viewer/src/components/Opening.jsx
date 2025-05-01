import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function Opening() {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 text-white font-bold text-center px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-6xl sm:text-7xl lg:text-8xl drop-shadow-lg"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-red-300">
          PokéDairy
        </span>
      </motion.div>

      {showTitle && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-lg sm:text-xl font-medium"
        >
          Gotta Search & Battle 'Em All!
        </motion.p>
      )}

      <motion.div
        className="absolute bottom-10 text-sm opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Powered by <span className="underline">PokeAPI</span>
      </motion.div>
    </div>
  );
}

export default Opening;
