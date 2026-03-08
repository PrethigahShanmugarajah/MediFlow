const InfoCard = ({ title, description }) => {
  return (
    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-left">
      <h3 className="font-semibold text-indigo-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default InfoCard;
