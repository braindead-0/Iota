import { motion } from 'motion/react';

export default function BiasVectorGrid() {
  const categories = ['Atmosphere', 'Gender', 'Ethnicity', 'Socio-economic', 'Age'];
  
  // Random grid data representation
  const gridData = [
    [0, 0, 0, 0, 0, 0, 0], // Atmosphere
    [0, 0, 0, 1, 0, 0, 0], // Gender (high value at index 3)
    [0, 0, 0, 0, 0, 0, 0], // Ethnicity
    [0, 1, 0, 0, 0, 0, 0], // Socio-economic (high value at index 1)
    [0, 0, 0, 0, 0, 0, 0], // Age
  ];

  return (
    <section>
      <h2 className="font-headline-lg text-4xl mb-8 font-bold">Bias Vector</h2>
      <div className="p-16 bg-white/40 border-[0.5px] border-black/5">
        <div className="flex flex-col gap-3">
          {categories.map((cat, rowIdx) => (
            <div key={cat} className="flex items-center gap-8">
              <div className="w-32 font-hero-display text-[10px] text-black/30 uppercase text-right tracking-widest leading-none">
                {cat}
              </div>
              <div className="flex gap-3">
                {gridData[rowIdx].map((val, colIdx) => (
                  <motion.div
                    key={`${cat}-${colIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (rowIdx * 0.1) + (colIdx * 0.05) }}
                    className={`risk-square ${val === 1 ? 'bg-black/60' : 'bg-black/5'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between px-32 font-hero-display text-[9px] text-black/20 uppercase tracking-[0.3em] font-bold">
          <span>Parity</span>
          <span>Variance</span>
          <span>Skew</span>
        </div>
      </div>
    </section>
  );
}
