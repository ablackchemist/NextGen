import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";

export function VirtualJoysticks({ setMove }: { setMove: (dir: string, active: boolean) => void }) {
  const handleStart = (dir: string) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMove(dir, true);
  };
  const handleEnd = (dir: string) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMove(dir, false);
  };

  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity select-none pointer-events-auto">
      <div className="flex justify-center">
        <button
          className="bg-white/20 backdrop-blur p-3 rounded-full border border-white/30 text-white"
          onMouseDown={handleStart("forward")}
          onMouseUp={handleEnd("forward")}
          onMouseLeave={handleEnd("forward")}
          onTouchStart={handleStart("forward")}
          onTouchEnd={handleEnd("forward")}
        >
          <ArrowUp size={24} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-white/20 backdrop-blur p-3 rounded-full border border-white/30 text-white"
          onMouseDown={handleStart("left")}
          onMouseUp={handleEnd("left")}
          onMouseLeave={handleEnd("left")}
          onTouchStart={handleStart("left")}
          onTouchEnd={handleEnd("left")}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="bg-white/20 backdrop-blur p-3 rounded-full border border-white/30 text-white"
          onMouseDown={handleStart("backward")}
          onMouseUp={handleEnd("backward")}
          onMouseLeave={handleEnd("backward")}
          onTouchStart={handleStart("backward")}
          onTouchEnd={handleEnd("backward")}
        >
          <ArrowDown size={24} />
        </button>
        <button
          className="bg-white/20 backdrop-blur p-3 rounded-full border border-white/30 text-white"
          onMouseDown={handleStart("right")}
          onMouseUp={handleEnd("right")}
          onMouseLeave={handleEnd("right")}
          onTouchStart={handleStart("right")}
          onTouchEnd={handleEnd("right")}
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <div className="bg-black/40 text-xs text-white/70 py-1 px-3 rounded-xl border border-white/10 flex items-center gap-2">
          <MousePointer2 size={12} /> Drag screen to look
        </div>
      </div>
    </div>
  );
}
