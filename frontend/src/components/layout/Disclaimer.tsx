export function Disclaimer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <span className="font-medium text-slate-600">OSPAT</span> provides informational
          decision support based on provided policy and hospital data. It does not provide
          medical diagnosis, clinical treatment recommendations, or binding insurance advice.
          Always verify coverage details with your insurer and treating hospital.
        </p>
      </div>
    </footer>
  );
}
