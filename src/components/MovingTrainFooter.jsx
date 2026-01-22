import trainMove from "../assets/train-move.png";

const MovingTrainFooter = () => {
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-50
                 bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50
                overflow-hidden z-20"
    >
      {/* Railway Track */}
      <div className="absolute bottom-0 w-full h-[3px] bg-slate-500 opacity-60"></div>

      {/* Moving Train */}
      <img
        src={trainMove}
        alt="Moving Train"
        className="absolute bottom-0 w-[280px] animate-trainMove"
      />
    </div>
  );
};

export default MovingTrainFooter;
