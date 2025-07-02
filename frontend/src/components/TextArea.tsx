import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => {
  const textareaId = id || label.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="mb-4">
      <label htmlFor={textareaId} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <textarea
        id={textareaId}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
        rows={5}
        {...props}
      />
    </div>
  );
};

export default TextArea; 