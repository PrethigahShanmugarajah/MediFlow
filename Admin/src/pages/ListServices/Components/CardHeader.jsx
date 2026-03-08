import { Calendar, Check, ChevronDown, Image, X } from "lucide-react";
import {
  capitalizeWords,
  CURRENCY,
  formatParagraph,
} from "../../../utils/helpers";
import { NoImage } from "../../../assets";

const CardHeader = ({ svc, isOpen, onToggle }) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 cursor-pointer"
      onClick={onToggle}
    >
      <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden bg-indigo-50 ring-1 ring-indigo-50 shrink-0">
        {svc.image ? (
          <img
            src={svc.image || NoImage}
            alt={svc.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-300">
            <Image />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-indigo-700 truncate">
              {capitalizeWords(svc.name)}
            </h2>

            <p className="text-sm text-indigo-500 mt-1 line-clamp-2">
              {formatParagraph(svc.about)}
            </p>
          </div>

          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <div className="text-md font-semibold text-indigo-700">
              {CURRENCY} {svc.price}
            </div>
            <div
              className={`text-xs mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                svc.available
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {svc.available ? (
                <>
                  <Check className="w-3 h-3" /> Available
                </>
              ) : (
                <>
                  <X className="w-3 h-3" /> Unavailable
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 font-bold text-sm text-indigo-600">
          <Calendar className="w-4 h-4" />
          <span>
            {svc.slots.length} Slot{svc.slots.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="pl-3 self-start sm:self-center">
        <ChevronDown
          className={`w-6 h-6 transition-transform ${
            isOpen ? "rotate-180 text-indigo-400" : "text-indigo-300"
          }`}
        />
      </div>
    </div>
  );
};

export default CardHeader;
