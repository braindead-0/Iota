import { motion } from 'motion/react';

export default function BiasVectorGrid({ audits }: { audits?: any[] }) {
  const categories = ['Atmosphere', 'Gender', 'Ethnicity', 'Socio-economic', 'Age'];
  
  // Calculate dynamic grid data based on recent audits
  const gridData = [
    [0, 0, 0, 0, 0, 0, 0], // Atmosphere
    [0, 0, 0, 0, 0, 0, 0], // Gender
    [0, 0, 0, 0, 0, 0, 0], // Ethnicity
    [0, 0, 0, 0, 0, 0, 0], // Socio-economic
    [0, 0, 0, 0, 0, 0, 0], // Age
  ];

  if (audits && audits.length > 0) {
    // Populate grid using real analytics_heat data
    audits.forEach((audit, aIdx) => {
      const heat = audit.analytics_heat || [];
      heat.forEach((val: number, hIdx: number) => {
        const row = hIdx % 5;
        const col = (aIdx + hIdx) % 7;
        // Mark as 1 if high risk
        if (val > 50) {
          gridData[row][col] = 1;
        } else if (val > 20 && gridData[row][col] === 0) {
           // Maybe half opacity or something, but we'll stick to binary for the grid style
           gridData[row][col] = 0.5 as any;
        }
      });
    });
  }

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
                    className={`risk-square ${val === 1 ? 'bg-black/60' : val > 0 ? 'bg-black/20' : 'bg-black/5'}`}
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
