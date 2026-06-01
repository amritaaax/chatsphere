const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 p-12 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-pink-500/20 rounded-full blur-3xl top-10 left-10 floating"></div>

      <div
        className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-10 floating"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-md text-center z-10">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        <h2 className="text-4xl font-extrabold text-white mb-4">{title}</h2>

        <p className="text-white/70 text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;