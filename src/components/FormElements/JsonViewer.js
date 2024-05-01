import React, { useState } from 'react';

const JsonViewer = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderContent = () => {
    if (Array.isArray(data) || typeof data === 'object') {
      return (
        <div>
          {Object.entries(data).map(([key, value], index) => (
            <div key={index} className="ml-4">
              <span className="font-bold">{key}:</span>
              {typeof value === 'object' ? (
                <JsonViewer data={value} />
              ) : (
                <span> {value.toString()}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <span>{data.toString()}</span>;
  };

  return (
    <div className="p-2 border border-gray-200 rounded shadow-sm">
      {typeof data === 'object' ? (
        <button
          onClick={toggleCollapse}
          className="text-left w-full text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          {isCollapsed ? '+' : '-'}
        </button>
      ) : null}
      {!isCollapsed && renderContent()}
    </div>
  );
};

export default JsonViewer;
