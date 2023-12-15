import { Component, JSX } from "solid-js";

interface InputProps {
  label: string;
  name: string;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  error?: string;
}

export const Input: Component<InputProps> = (props) => {
  return (
    <div>
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for={props.name}
      >
        {props.label}
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={props.name}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
      />
      {props.error && <p class="text-red-500 text-xs italic">{props.error}</p>}
    </div>
  );
};
