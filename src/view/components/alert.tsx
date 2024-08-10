type AlertProps = {
    type: string;
    message: string;
    onClose: () => void;
  };
  
  const Alert = ({ type, message, onClose }: AlertProps) => {
    let color = "";
    let title = "";
    if (type === "success") {
      color = "green";
      title = "Sucesso!";
    } else if (type === "error") {
      color = "red";
      title = "Erro!";
    }
  
    return (
      <div className={`bg-${color}-700 border border-white text-white px-4 py-3 rounded relative m-2`} role="alert">
        <strong className="font-bold flex gap-1">{title}</strong>
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            onClick={onClose}
            className={`fill-current h-6 w-6 text-${color}-500`}
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    );
  };
  
  export default Alert;