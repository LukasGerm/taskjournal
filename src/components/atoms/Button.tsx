import { ParentComponent, JSX } from "solid-js";

interface ButtonProps {
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

export const Button: ParentComponent<ButtonProps> = (props) => {
  return (
    <button
      class="bg-primary hover:bg-primaryHover text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type={props.type || "button"}
    >
      {props.children}
    </button>
  );
};
