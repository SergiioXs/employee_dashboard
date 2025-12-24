import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "add" | "delete" | "edit"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  type?: "add" | "delete" | "edit"; 
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  type,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  /*
   shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition 
  bg-brand-500 text-white  hover:bg-brand-600
  */


  // Variant Classes
  const basicVariantBtn = "shadow-theme-xs text-white font-medium transition";
  const variantClasses = {
    primary: "bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 "+basicVariantBtn,
    add:     "bg-success-500 hover:bg-success-600 disabled:bg-success-300 "+basicVariantBtn,
    edit:    "bg-warning-500 hover:bg-warning-600 disabled:bg-warning-300 "+basicVariantBtn,
    delete:  "bg-error-500 hover:bg-error-600 disabled:bg-error-300 "+basicVariantBtn,
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  return (
    <button
      className={
        `inline-flex items-center justify-center gap-2 rounded-lg transition 
        ${className} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
      onClick={onClick}
      disabled={disabled}
    >

      { // ADD
        variant == "add" && <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10.0002H15.0006M10.0002 5V15.0006" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>  
        </span>
      }

      
      { // DELETE
        variant == "delete" && <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>  
        </span>
      }

      
      { // EDIT
        variant == "edit" && <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>  
          
        </span>
      }

      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
