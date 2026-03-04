// MediFlow / Client / src / components / doctor / DocTitle.jsx

const DocTitle = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl pt-10 xl:pt-0 uppercase lg:pt-0 sm:text-3xl font-extrabold tracking-tight text-indigo-900">
        {title}
      </h1>

      {description && (
        <p className="text-sm sm:text-base text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default DocTitle;
