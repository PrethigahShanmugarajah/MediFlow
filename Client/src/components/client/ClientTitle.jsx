// MediFlow / Client / src / components / common / ClientTitle.jsx

const ClientTitle = ({ title, description }) => {
  const colors = ["text-indigo-600", "text-blue-600", "text-black"];

  const words = title.split(" ");

  return (
    <div>
      <div className="relative inline-block">
        <div className="absolute -left-20 top-1/2 w-16 h-0.5 bg-linear-to-br from-blue-100 to-indigo-500"></div>
        <div className="absolute -right-20 top-1/2 w-16 h-0.5 bg-linear-to-br from-indigo-100 to-blue-500"></div>
        <h2 className="text-3xl lg:text-4xl font-serif mb-4 tracking-tight uppercase">
          {words.map((word, index) => (
            <span
              key={index}
              className={`${colors[index % colors.length]} mr-2`}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {description && (
        <p className="text-md text-gray-500 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
};

export default ClientTitle;
