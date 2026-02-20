// MediFlow / Client / src / components / Footer / Components / FooterBottom.jsx

const FooterBottom = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center lg:justify-between items-center gap-4 md:gap-6 border-t border-indigo-100 pt-6">
      <div className="text-indigo-700 text-sm md:text-base font-medium flex items-center gap-2">
        <span>&copy; {new Date().getFullYear()} MediFlow Healthcare.</span>
      </div>

      <div className="text-indigo-700 text-sm md:text-base font-medium flex items-center gap-2">
        <span>Designed by</span>
        <a
          href={import.meta.env.VITE_LINK}
          className="font-bold text-indigo-500 hover:text-zinc-700 transition-colors duration-300"
        >
          MediFlow
        </a>
      </div>
    </div>
  );
};

export default FooterBottom;
