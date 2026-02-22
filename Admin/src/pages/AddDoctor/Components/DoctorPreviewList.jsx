// MediFlow / Admin / src / pages / AddDoctor / Components / DoctorPreviewList.jsx

const DoctorPreviewList = ({ doctorList }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      {doctorList.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctorList.map((d) => (
            <div
              key={d.id || d._id}
              className="p-4 rounded-xl border border-gray-300 bg-white/80 shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={d.imageUrl || d.imagePreview}
                  alt={d.name}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div>
                  <div className="text-gray-500">
                    Name:{" "}
                    <span className="font-semibold text-black">{d.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Specialization:{" "}
                    <span className="font-semibold text-black">
                      {d.specialization}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No Doctor Yet.</p>
      )}
    </div>
  );
};

export default DoctorPreviewList;
