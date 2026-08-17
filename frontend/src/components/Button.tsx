type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

const Button = ({ children, type = "button" }: ButtonProps) => {
  return <button type={type}>{children}</button>;
};

export default Button;
