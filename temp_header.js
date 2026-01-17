
// --- Componente Reutilizable: Cabecera de Sección ---
const SectionHeader = ({ title, subtitle, icon }) => (
    <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-fuchsia-600/10 border border-fuchsia-500/30 text-fuchsia-400 animate-pulse-slow">
            {icon || <Star className="w-6 h-6" />}
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic">
            {title}
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
        </p>
    </div>
);
