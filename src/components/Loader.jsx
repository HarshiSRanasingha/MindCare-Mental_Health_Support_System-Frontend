const Loader = ({ fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="loader-inline">
      <div className="spinner-sm"></div>
    </div>
  );
};

export default Loader;
