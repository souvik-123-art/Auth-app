import React from "react";

function Input({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}) {
  return (
    <div className="relative mb-6">
      {/* Left Icon */}
      {LeftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <LeftIcon className="size-5 text-green-500" />
        </div>
      )}

      {/* Input Field */}
      <input
        {...props}
        className={`w-full py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700
            focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 
            transition duration-200 pl-10
            ${RightIcon ? "pr-10" : "pr-3"}`}
      />

      {/* Right Icon */}
      {RightIcon && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={onRightIconClick}
        >
          <RightIcon className="size-5 text-green-500 hover:text-green-400 cursor-pointer" />
        </button>
      )}
    </div>
  );
}

export default Input;
