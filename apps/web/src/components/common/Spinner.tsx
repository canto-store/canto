import "./spinner.css";

const Spinner = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="dots-spinner">
        <span className="dot-1"></span>
        <span className="dot-2"></span>
        <span className="dot-3"></span>
      </div>
    </main>
  );
};

export default Spinner;
