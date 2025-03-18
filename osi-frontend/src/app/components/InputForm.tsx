import React from "react";

type InputFormProps = {
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: () => void;
  loading: boolean;
};

const InputForm: React.FC<InputFormProps> = ({ url, setUrl, handleSubmit, loading }) => {
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        className="p-2 border-2 border-blue-500 rounded-lg w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700 placeholder-gray-500 text-gray-700"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Visualize"}
      </button>
    </div>
  );
};

export default InputForm;
