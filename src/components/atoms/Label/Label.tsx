type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export function Label({ ...props }: LabelProps) {
  return <label {...props} />;
}
