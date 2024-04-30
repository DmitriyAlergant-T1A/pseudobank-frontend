import React from 'react';

const TextInputEntry = React.memo(({
  labeltext,
  isMandatory,
  placeholder,
  value = '',
  id,
  extraCSSClassLabel = "",
  extraCSSClassInput = "",
  onChangeHandler = (e) => {},
  onInputHandler = (e) => {}
}) => {
  return (
    <div className="mb-4 flex items-center">
      <div className={`block w-2/3 ${extraCSSClassLabel}`}>
        {isMandatory && <label className="text-sm font-medium text-red-700 mr-1">*</label>}
        <label className="text-sm font-medium text-gray-700">{labeltext}</label>
      </div>
      <input
        value={value}
        onChange={onChangeHandler}
        onInput={onInputHandler}
        type="text"
        placeholder={placeholder}
        id={id}
        className={`w-1/3 mt-1 p-2 w-full border rounded ${extraCSSClassInput}`}
      />
    </div>
  );
});

export default TextInputEntry;
