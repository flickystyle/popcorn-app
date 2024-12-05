const ErrorMessage = ({ children }) => {
    return (
        <p className="error">
            <span>⛔</span>
            {children}
        </p>
    );
};

export default ErrorMessage;
