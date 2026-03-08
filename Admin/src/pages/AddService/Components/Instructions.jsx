import { Plus, Trash2 } from "lucide-react";
import { InputField } from "../../../components/FormField/InputField";

const Instructions = ({ instructions, setInstructions, errors }) => {
  function addInstruction() {
    setInstructions((s) => [...s, ""]);
  }

  function updateInstruction(i, v) {
    setInstructions((s) => s.map((x, idx) => (idx === i ? v : x)));
  }

  function removeInstruction(i) {
    setInstructions((s) => s.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-black">
          Instructions (point wise){" "}
          <span className="text-rose-500 ml-1">*</span>
        </label>

        <button
          type="button"
          onClick={addInstruction}
          className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="mt-3 space-y-4">
        {instructions.map((ins, idx) => {
          const val = String(ins ?? "");
          const showErr = errors.instructions && !val.trim();

          return (
            <div key={idx} className="flex flex-col">
              <div className="flex items-start gap-3 my-2 bg-white rounded-full p-3 border border-indigo-50 shadow-sm hover:shadow transition-shadow min-w-0">
                <div className="font-semibold text-indigo-600">{idx + 1}.</div>

                <InputField
                  name={`instruction_${idx}`}
                  type="text"
                  size="s"
                  placeholder={`Instruction ${idx + 1}`}
                  value={val}
                  onChange={(v) => updateInstruction(idx, v)}
                  unstyled={true}
                />

                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    className="p-2 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                )}
              </div>

              {showErr && (
                <p className="text-rose-500 text-sm mt-0 ml-10">
                  Instruction is required.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Instructions;
