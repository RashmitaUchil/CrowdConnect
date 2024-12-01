import PropTypes from 'prop-types';

export function Link({ href, children, variant = 'primary', icon: Icon }) {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  return (
    <a href={href} className={`${baseStyles} ${variants[variant]}`}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </a>
  );
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  icon: PropTypes.elementType
};